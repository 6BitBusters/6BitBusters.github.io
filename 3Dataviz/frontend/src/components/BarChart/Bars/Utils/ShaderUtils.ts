import * as THREE from "three";

export function LoadShader(shaderPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileLoader = new THREE.FileLoader();

    fileLoader.load(
      shaderPath,
      (shaderData) => {
        const shaderString =
        typeof shaderData === "string"
        ? shaderData
        : new TextDecoder().decode(shaderData);
        if (shaderString.startsWith("<!doctype html>")) {
          reject("File is not a shader");
        } else {
          resolve(shaderString);
        }
        resolve(shaderString);
      },
      undefined,
      (error) => {
        reject(error);
      },
    );
  });
}
