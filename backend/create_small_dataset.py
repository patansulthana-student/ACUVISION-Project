
from pathlib import Path
import shutil
import random


BASE_DIR = Path(
    r"C:\Users\patan\OneDrive\Desktop\ACUVISION"
)

SOURCE = (
    BASE_DIR / "combined_dataset"
)

OUTPUT = (
    BASE_DIR / "acuvision_fast_dataset"
)

TRAIN_LIMIT = 1500
VALID_LIMIT = 300

random.seed(42)


CLASS_NAMES = [
    "person",
    "chair",
    "table",
    "backpack",
    "bottle",
    "phone",
    "laptop",
    "notebook",
    "keyboard",
    "mouse",
    "blackboard",
    "projector",
    "monitor",
    "whiteboard",
    "desk",
    "trash_bin",
    "book",
]


for split in ("train", "valid", "test"):

    (OUTPUT / "images" / split).mkdir(
        parents=True,
        exist_ok=True
    )

    (OUTPUT / "labels" / split).mkdir(
        parents=True,
        exist_ok=True
    )


def get_images(folder):

    files = []

    for pattern in (
        "*.jpg",
        "*.jpeg",
        "*.png",
        "*.webp",
        "*.bmp",
    ):

        files.extend(folder.glob(pattern))

    return files


def copy_split(split, limit=None):

    source_images = (
        SOURCE / "images" / split
    )

    source_labels = (
        SOURCE / "labels" / split
    )

    destination_images = (
        OUTPUT / "images" / split
    )

    destination_labels = (
        OUTPUT / "labels" / split
    )

    images = get_images(
        source_images
    )

    random.shuffle(images)

    if limit is not None:
        images = images[:limit]

    copied = 0

    for image in images:

        label = (
            source_labels
            / f"{image.stem}.txt"
        )

        if not label.exists():
            continue

        shutil.copy2(
            image,
            destination_images / image.name
        )

        shutil.copy2(
            label,
            destination_labels / label.name
        )

        copied += 1

    print(
        f"{split}: {copied} images copied"
    )


print("=" * 60)
print("ACUVISION FAST DATASET")
print("=" * 60)

copy_split(
    "train",
    TRAIN_LIMIT
)

copy_split(
    "valid",
    VALID_LIMIT
)

copy_split(
    "test",
    None
)


yaml_text = (
    f"path: {OUTPUT.as_posix()}\n\n"
    "train: images/train\n"
    "val: images/valid\n"
    "test: images/test\n\n"
    "names:\n"
)

for index, name in enumerate(CLASS_NAMES):

    yaml_text += (
        f"  {index}: {name}\n"
    )


(
    OUTPUT / "data.yaml"
).write_text(
    yaml_text,
    encoding="utf-8"
)


print()
print("=" * 60)
print("FAST DATASET CREATED")
print("=" * 60)
print()
print(f"Location: {OUTPUT}")
print(f"Train: {TRAIN_LIMIT}")
print(f"Valid: {VALID_LIMIT}")
print("Test: all available")