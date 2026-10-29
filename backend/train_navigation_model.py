# =========================================================
# ACUVISION — CUSTOM NAVIGATION MODEL TRAINING
# =========================================================

from pathlib import Path
from ultralytics import YOLO


# =========================================================
# PROJECT PATHS
# =========================================================

BASE_DIR = Path(
    r"C:\Users\patan\OneDrive\Desktop\ACUVISION"
)

DATASET_YAML = (
    BASE_DIR
    / "acuvision_fast_dataset"
    / "data.yaml"
)

BASE_MODEL = (
    BASE_DIR
    / "backend"
    / "yolo11n.pt"
)

MODELS_DIR = (
    BASE_DIR
    / "models"
)


# =========================================================
# CHECK REQUIRED FILES
# =========================================================

print("=" * 60)
print("ACUVISION - TRAINING PRECHECK")
print("=" * 60)
print()

print("Dataset YAML:")
print(DATASET_YAML)
print()

print("Base YOLO model:")
print(BASE_MODEL)
print()


if not DATASET_YAML.exists():
    raise FileNotFoundError(
        f"Dataset configuration not found:\n{DATASET_YAML}"
    )


if not BASE_MODEL.exists():
    raise FileNotFoundError(
        f"Base YOLO model not found:\n{BASE_MODEL}"
    )


# =========================================================
# CREATE OUTPUT DIRECTORY
# =========================================================

MODELS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# LOAD YOLO11n
# =========================================================

print("=" * 60)
print("Loading ACUVISION base YOLO11n model...")
print("=" * 60)
print()

model = YOLO(
    str(BASE_MODEL)
)


# =========================================================
# TRAIN
# =========================================================

print("=" * 60)
print("Starting ACUVISION custom navigation training...")
print("=" * 60)
print()

results = model.train(
    data=str(DATASET_YAML),

    epochs=10,

    imgsz=416,

    batch=4,

    workers=0,

    patience=5,

    pretrained=True,

    project=str(MODELS_DIR),

    name="acuvision_navigation",

    exist_ok=True,

    val=True,

    verbose=True
)


# =========================================================
# BEST MODEL
# =========================================================

BEST_MODEL = (
    MODELS_DIR
    / "acuvision_navigation"
    / "weights"
    / "best.pt"
)


# =========================================================
# COMPLETE
# =========================================================

print()
print("=" * 60)
print("ACUVISION CUSTOM MODEL TRAINING COMPLETE")
print("=" * 60)
print()

if BEST_MODEL.exists():
    print("BEST MODEL:")
    print(BEST_MODEL)
else:
    print("WARNING: best.pt was not found at:")
    print(BEST_MODEL)

print()