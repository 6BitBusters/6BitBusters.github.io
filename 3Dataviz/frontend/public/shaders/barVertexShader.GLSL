attribute vec3 color;
attribute float instanceOpacity;

varying vec3 vNormal;
varying vec3 vBaseColor;
varying float vOpacity;
varying vec3 vWorldPosition;

void main() {
  vBaseColor = color;
  vOpacity = instanceOpacity;
  vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
  vWorldPosition = (modelMatrix * worldPosition).xyz;
   mat3 normalMatrix = transpose(inverse(mat3(modelMatrix * instanceMatrix)));
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}