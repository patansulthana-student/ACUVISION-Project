# =========================================================
# ACUVISION — COMBINE CLASSROOM-300 + LAB DATASETS
# Keeps TRAIN + VALID + TEST
# =========================================================

from pathlib import Path
import shutil


# =========================================================
# DATASET PATHS
# =========================================================

CLASSROOM_DATASET = Path(
    r"C:\Users\patan\Downloads\Classroom-300.v1i.yolov11"
)

LAB_DATASET = Path(
    r"C:\Users\patan\Downloads\lab.v1i.yolov11"
)

BASE_DIR = Path(
    r"C:\Users\patan\OneDrive\Desktop\ACUVISION"
)

OUTPUT_DIR = (
    BASE_DIR / "combined_dataset"
)


# =========================================================
# FINAL ACUVISION CLASSES
# =========================================================

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


# =========================================================
# CLASSROOM-300 ORIGINAL CLASS IDs
# =========================================================
#
# 0  backpack
# 1  barbie doll
# 2  blackboard
# 3  book
# 4  calculator
# 5  chair
# 6  chalk
# 7  chick stuffed toy
# 8  child
# 9  clock
# 10 cube-block
# 11 cylinder-block
# 12 desk
# 13 dog stuffed toy
# 14 eraser
# 15 facemask
# 16 glue
# 17 keyboard
# 18 laptop
# 19 lunch box
# 20 marker
# 21 monitor
# 22 monkey stuffed toy
# 23 mouse
# 24 off light
# 25 on light
# 26 panda stuffed toy
# 27 pencil
# 28 pencil case
# 29 penguin stuffed toy
# 30 person
# 31 projector
# 32 puzzle piece
# 33 scissor
# 34 shelf
# 35 shoe
# 36 sphere-block
# 37 teddy bear
# 38 toy car
# 39 trash bin
# 40 tv
# 41 watch
# 42 water bottle
# 43 white board
#
# Final ACUVISION IDs:
#
# 0  person
# 1  chair
# 2  table
# 3  backpack
# 4  bottle
# 5  phone
# 6  laptop
# 7  notebook
# 8  keyboard
# 9  mouse
# 10 blackboard
# 11 projector
# 12 monitor
# 13 whiteboard
# 14 desk
# 15 trash_bin
# 16 book
# =========================================================

CLASSROOM_MAP = {
    0: 3,    # backpack
    2: 10,   # blackboard
    3: 16,   # book
    5: 1,    # chair
    12: 14,  # desk
    17: 8,   # keyboard
    18: 6,   # laptop
    21: 12,  # monitor
    23: 9,   # mouse
    30: 0,   # person
    31: 11,  # projector
    39: 15,  # trash bin
}


# =========================================================
# NOTE
# Classroom-300 "water bottle" is intentionally NOT
# remapped here because LAB provides the clean "bottle"
# class. We will use LAB for bottle detection.
# =========================================================


# =========================================================
# LAB ORIGINAL CLASS IDs
# =========================================================
#
# 0 bottle
# 1 chair
# 2 keyboard
# 3 laptop
# 4 monitor
# 5 person
# 6 phone
#
# Final ACUVISION IDs:
#
# bottle   -> 4
# chair    -> 1
# keyboard -> 8
# laptop   -> 6
# monitor  -> 12
# person   -> 0
# phone    -> 5
# =========================================================

LAB_MAP = {
    0: 4,    # bottle
    1: 1,    # chair
    2: 8,    # keyboard
    3: 6,    # laptop
    4: 12,   # monitor
    5: 0,    # person
    6: 5,    # phone
}


# =========================================================
# CREATE OUTPUT DIRECTORIES
# =========================================================

for split in ("train", "valid", "test"):

    (
        OUTPUT_DIR
        / "images"
        / split
    ).mkdir(
        parents=True,
        exist_ok=True
    )

    (
        OUTPUT_DIR
        / "labels"
        / split
    ).mkdir(
        parents=True,
        exist_ok=True
    )


# =========================================================
# FIND IMAGES
# =========================================================

def find_images(folder):

    image_files = []

    for extension in (
        "*.jpg",
        "*.jpeg",
        "*.png",
        "*.webp",
        "*.bmp"
    ):

        image_files.extend(
            folder.glob(extension)
        )

    return image_files


# =========================================================
# PROCESS ONE DATASET
# =========================================================

def process_dataset(
    dataset_path,
    class_map,
    prefix
):

    print()
    print("-" * 60)
    print(f"Processing {prefix}")
    print("-" * 60)

    for split in ("train", "valid", "test"):

        source_split = (
            dataset_path / split
        )

        source_images = (
            source_split / "images"
        )

        source_labels = (
            source_split / "labels"
        )

        if not source_split.exists():

            print(
                f"{prefix} {split}: folder not found, skipping"
            )

            continue

        if not source_images.exists():

            raise FileNotFoundError(
                f"Images folder not found:\n"
                f"{source_images}"
            )

        if not source_labels.exists():

            raise FileNotFoundError(
                f"Labels folder not found:\n"
                f"{source_labels}"
            )

        output_images = (
            OUTPUT_DIR
            / "images"
            / split
        )

        output_labels = (
            OUTPUT_DIR
            / "labels"
            / split
        )

        image_files = find_images(
            source_images
        )

        print(
            f"{prefix} {split}: "
            f"{len(image_files)} images found"
        )

        copied = 0
        skipped = 0

        for image_file in image_files:

            source_label = (
                source_labels
                / f"{image_file.stem}.txt"
            )

            if not source_label.exists():

                skipped += 1
                continue

            # Unique filename so datasets don't overwrite each other
            new_stem = (
                f"{prefix}_{image_file.stem}"
            )

            new_image = (
                output_images
                / f"{new_stem}{image_file.suffix}"
            )

            new_label = (
                output_labels
                / f"{new_stem}.txt"
            )

            # ---------------------------------------------
            # COPY IMAGE
            # ---------------------------------------------

            shutil.copy2(
                image_file,
                new_image
            )

            # ---------------------------------------------
            # REMAP LABELS
            # ---------------------------------------------

            output_lines = []

            for line in source_label.read_text(
                encoding="utf-8"
            ).splitlines():

                parts = line.split()

                if len(parts) != 5:

                    continue

                try:

                    old_class = int(
                        parts[0]
                    )

                except ValueError:

                    continue

                # Ignore classes that we don't want
                if old_class not in class_map:

                    continue

                new_class = (
                    class_map[old_class]
                )

                parts[0] = str(
                    new_class
                )

                output_lines.append(
                    " ".join(parts)
                )

            # ---------------------------------------------
            # WRITE LABEL FILE
            # ---------------------------------------------

            new_label.write_text(
                (
                    "\n".join(
                        output_lines
                    )
                    + (
                        "\n"
                        if output_lines
                        else ""
                    )
                ),
                encoding="utf-8"
            )

            copied += 1

        print(
            f"{prefix} {split}: "
            f"{copied} copied, "
            f"{skipped} missing labels"
        )


# =========================================================
# CHECK DATASETS
# =========================================================

print("=" * 60)
print("ACUVISION DATASET COMBINATION")
print("=" * 60)

if not CLASSROOM_DATASET.exists():

    raise FileNotFoundError(
        f"Classroom-300 dataset not found:\n"
        f"{CLASSROOM_DATASET}"
    )

if not LAB_DATASET.exists():

    raise FileNotFoundError(
        f"LAB dataset not found:\n"
        f"{LAB_DATASET}"
    )


# =========================================================
# PROCESS DATASETS
# =========================================================

process_dataset(
    CLASSROOM_DATASET,
    CLASSROOM_MAP,
    "classroom"
)

process_dataset(
    LAB_DATASET,
    LAB_MAP,
    "lab"
)


# =========================================================
# CREATE FINAL data.yaml
# =========================================================

yaml_lines = [

    f"path: {OUTPUT_DIR.as_posix()}",
    "",
    "train: images/train",
    "val: images/valid",
    "test: images/test",
    "",
    "names:"

]

for index, class_name in enumerate(
    CLASS_NAMES
):

    yaml_lines.append(
        f"  {index}: {class_name}"
    )


(
    OUTPUT_DIR / "data.yaml"
).write_text(
    "\n".join(yaml_lines)
    + "\n",
    encoding="utf-8"
)


# =========================================================
# FINAL SUMMARY
# =========================================================

print()
print("=" * 60)
print("ACUVISION DATASET COMBINATION COMPLETE")
print("=" * 60)
print()

print(
    f"Output: {OUTPUT_DIR}"
)

print()
print("Final classes:")

for index, name in enumerate(
    CLASS_NAMES
):

    print(
        f"{index}: {name}"
    )

print()
print(
    "Train:",
    OUTPUT_DIR / "images" / "train"
)

print(
    "Valid:",
    OUTPUT_DIR / "images" / "valid"
)

print(
    "Test:",
    OUTPUT_DIR / "images" / "test"
)

print()