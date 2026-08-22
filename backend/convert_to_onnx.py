import os
import tensorflow as tf
import keras
import tf2onnx
import onnx

model_path = os.path.join(os.path.dirname(__file__), "model", "diabetic_retinopathy_model.keras")
output_onnx_path = os.path.join(os.path.dirname(__file__), "model", "diabetic_retinopathy_model.onnx")

print(f"Loading Keras model from {model_path}...")
model = keras.models.load_model(model_path, compile=False)

input_signature = [tf.TensorSpec([None, 224, 224, 3], tf.float32, name="input_image")]
print("Converting Keras model to ONNX...")
onnx_model, _ = tf2onnx.convert.from_keras(model, input_signature=input_signature, opset=13)

onnx.save(onnx_model, output_onnx_path)
print(f"Successfully saved ONNX model to {output_onnx_path} (Size: {os.path.getsize(output_onnx_path) / (1024*1024):.2f} MB)")
