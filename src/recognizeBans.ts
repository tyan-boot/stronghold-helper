import * as ort from "onnxruntime-web/wasm";

const names = [
  "不屈",
  "乌萨斯",
  "伊比利亚",
  "助力",
  "协防干员",
  "卡西米尔",
  "叙拉古",
  "坚守",
  "奇迹",
  "奥术",
  "投资人",
  "灵巧",
  "炎",
  "独行",
  "突袭",
  "精准",
  "绝技",
  "维多利亚",
  "聚合",
  "莱塔尼亚",
  "萨尔贡",
  "调和",
  "谢拉格",
  "迅捷",
  "远见",
  "阿戈尔",
];

export type RecognitionProgress =
  | { stage: "downloading"; loaded: number; total: number | null }
  | { stage: "initializing" | "recognizing" };

const size = 1024;
let session: Promise<ort.InferenceSession> | undefined;

export async function recognizeBans(
  file: File,
  onProgress: (progress: RecognitionProgress) => void,
): Promise<string[]> {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;
  const scale = Math.min(size / image.width, size / image.height);
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const left = Math.round((size - width) / 2 - 0.1);
  const top = Math.round((size - height) / 2 - 0.1);

  context.fillStyle = "rgb(114, 114, 114)";
  context.fillRect(0, 0, size, size);
  context.drawImage(image, left, top, width, height);
  image.close();

  const pixels = context.getImageData(0, 0, size, size).data;
  const plane = size * size;
  const input = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    input[i] = pixels[i * 4] / 255;
    input[plane + i] = pixels[i * 4 + 1] / 255;
    input[2 * plane + i] = pixels[i * 4 + 2] / 255;
  }

  session ??= new Promise<ArrayBuffer>((resolve, reject) => {
    onProgress({ stage: "downloading", loaded: 0, total: null });
    const request = new XMLHttpRequest();
    request.open("GET", `${import.meta.env.BASE_URL}models/covenants.onnx`);
    request.responseType = "arraybuffer";
    request.onprogress = (event) => onProgress({
      stage: "downloading",
      loaded: event.loaded,
      total: event.lengthComputable && event.total > 0 ? event.total : null,
    });
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve(request.response);
      else reject(new Error(`模型下载失败：HTTP ${request.status}`));
    };
    request.onerror = () => reject(new Error("模型下载失败，请检查网络连接"));
    request.send();
  }).then((bytes) => {
    onProgress({ stage: "initializing" });
    return ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
  }).catch((error: unknown) => {
    session = undefined;
    throw error;
  });
  const model = await session;
  onProgress({ stage: "recognizing" });
  const output = await model.run({
    [model.inputNames[0]]: new ort.Tensor("float32", input, [1, 3, size, size]),
  });
  const detections = output[model.outputNames[0]].data as Float32Array;
  const found = new Set<string>();
  for (let i = 0; i < detections.length; i += 6) {
    if (detections[i + 4] >= 0.25 && names[detections[i + 5]]) {
      found.add(names[detections[i + 5]]);
    }
  }
  return [...found];
}
