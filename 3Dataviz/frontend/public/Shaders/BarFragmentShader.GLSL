uniform vec3 ambientColor;
uniform vec3 pointLightPosition;
uniform vec3 pointLightColor;
uniform float pointLightIntensity;
uniform float pointLightDistance;
uniform samplerCube pointLightShadowMap;

varying vec3 vBaseColor;
varying float vOpacity;
varying vec3 vWorldPosition;
varying vec3 vNormal;

float getPointShadow(vec3 lightDir) {
    float lightDistance = length(lightDir);
    vec3 shadowMapDir = normalize(lightDir);
    float shadowMapValue = textureCube(pointLightShadowMap, shadowMapDir).r;
    float surfaceDepth = lightDistance / pointLightDistance;
    surfaceDepth = surfaceDepth * 0.5 + 0.5;
    float shadowBias = 0.005;
    float shadow = surfaceDepth > shadowMapValue + shadowBias ? 0.5 : 1.0;
    return shadow;
}

void main() {
    vec3 lightDir = pointLightPosition - vWorldPosition;
    float attenuation = 1.0;
    if (pointLightDistance > 0.0) {
        float distToLight = length(lightDir);
        attenuation = 1.0 - min(1.0, distToLight / pointLightDistance);
        attenuation = attenuation * attenuation;
    }
    vec3 normal = normalize(vNormal);
  
    vec3 lightContribution = pointLightColor * pointLightIntensity * attenuation * max(0.0, dot(normalize(lightDir), normal));
    float shadowFactor = getPointShadow(lightDir);
    vec3 finalColor = vBaseColor * (ambientColor + lightContribution) * shadowFactor;
    gl_FragColor = vec4(finalColor, vOpacity);
}