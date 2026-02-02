import os
import tiktoken
from pathlib import Path

# --- CONFIGURATION ---
PROJECT_ROOT = "."
MAX_TOKENS = 20000
MODEL_ENCODING = "cl100k_base"
# Added package-lock.json to the ignore list
IGNORE_FILES = {'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store'}
IGNORE_DIRS = {'.git', 'node_modules', '.next', 'dist', 'build', '__pycache__', 'public', "data"}
IGNORE_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'}

def get_directory_tree(root_dir):
    """Generates a string representation of the directory tree."""
    tree = []
    for root, dirs, files in os.walk(root_dir):
        # Filter out ignored directories in-place
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        level = root.replace(root_dir, '').count(os.sep)
        indent = '│   ' * level
        tree.append(f"{indent}├── {os.path.basename(root)}/")

        sub_indent = '│   ' * (level + 1)
        for f in files:
            if f not in IGNORE_FILES and not any(f.endswith(ext) for ext in IGNORE_EXTS):
                tree.append(f"{sub_indent}├── {f}")
    return "\n".join(tree)

def build_context_chunks():
    encoding = tiktoken.get_encoding(MODEL_ENCODING)

    # 1. Generate the Tree Structure once
    tree_content = get_directory_tree(PROJECT_ROOT)
    tree_header = f"PROJECT STRUCTURE:\n{tree_content}\n\n{'='*50}\n"
    tree_tokens = len(encoding.encode(tree_header))

    current_chunk = [tree_header]
    current_tokens = tree_tokens
    all_chunks = []

    # 2. Iterate through files recursively
    for path in Path(PROJECT_ROOT).rglob('*'):
        # Skip if in ignored dir, is a directory itself, or is in ignore lists
        if (any(part in IGNORE_DIRS for part in path.parts) or
                not path.is_file() or
                path.name in IGNORE_FILES or
                path.suffix in IGNORE_EXTS):
            continue

        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                file_entry = f"\nFILE: {path}\nCONTENT:\n{content}\n---\n"
                file_tokens = len(encoding.encode(file_entry))

                # Handle files larger than the limit itself
                if file_tokens + tree_tokens > MAX_TOKENS:
                    print(f"⚠️ Warning: {path} is too large for a single chunk. Truncating.")
                    file_entry = file_entry[:(MAX_TOKENS - tree_tokens) * 4] # Rough char limit
                    file_tokens = MAX_TOKENS - tree_tokens

                # Check if adding this file exceeds the chunk limit
                if current_tokens + file_tokens > MAX_TOKENS:
                    all_chunks.append("".join(current_chunk))
                    # Reset: Every new chunk starts with the tree for context
                    current_chunk = [tree_header, file_entry]
                    current_tokens = tree_tokens + file_tokens
                else:
                    current_chunk.append(file_entry)
                    current_tokens += file_tokens
        except Exception as e:
            print(f"Skipping {path} due to error: {e}")

    # Add the final chunk
    if len(current_chunk) > 1 or (current_chunk and current_chunk[0] != tree_header):
        all_chunks.append("".join(current_chunk))

    return all_chunks

if __name__ == "__main__":
    chunks = build_context_chunks()

    if not chunks:
        print("No files found to process.")
    else:
        for i, chunk in enumerate(chunks):
            out_file = f"llm_context_part_{i+1}.txt"
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(chunk)
            print(f"✅ Created {out_file} (Approx {len(tiktoken.get_encoding(MODEL_ENCODING).encode(chunk))} tokens)")