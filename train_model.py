
from pathlib import Path
import tensorflow as tf

# Dataset and model locations
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)

IMG_SIZE = (224, 224)
BATCH_SIZE = 8
EPOCHS = 10

# Load training images
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "train",
    class_names=["safe", "unsafe"],
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="binary",
    seed=42
)

# Load separate testing images
test_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "test",
    class_names=["safe", "unsafe"],
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="binary",
    shuffle=False
)

# Build a small image classifier
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(224, 224, 3)),
    tf.keras.layers.Rescaling(1.0 / 255),
    tf.keras.layers.Conv2D(16, 3, activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(32, 3, activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64, 3, activation="relu"),
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(1, activation="sigmoid")
])

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# Train and evaluate
model.fit(
    train_ds,
    epochs=EPOCHS,
    validation_data=test_ds
)

loss, accuracy = model.evaluate(test_ds, verbose=0)

model.save(MODEL_DIR / "safeher_model.keras")

print(f"\nTest accuracy: {accuracy * 100:.2f}%")
print(f"Model saved at: {MODEL_DIR / 'safeher_model.keras'}")
print("Class mapping: 0 = safe, 1 = unsafe")
