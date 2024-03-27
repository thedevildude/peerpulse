import { BlobServiceClient } from "@azure/storage-blob";
import { Request } from "express";
import { IncomingHttpHeaders, get } from "http";

const connectionString = process.env.SAS_URL;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(connectionString!);
const blobEndpoint = process.env.BLOB_ENDPOINT;
const containerClient = blobServiceClient.getContainerClient(containerName!);

export const listContainers = async () => {
  let i = 1;
  const containers = blobServiceClient.listContainers();
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`);
  }
};

function extractMetadata(headers: IncomingHttpHeaders) {
  const contentType = headers["content-type"] ?? "";
  const fileType = contentType.split("/")[1];
  const contentDisposition = headers["content-disposition"] || "";
  const caption = headers["x-image-caption"] || "No caption provided";
  const matches = /filename="([^"]+)"/i.exec(contentDisposition);
  const fileName = matches?.[1] || `uploads/image-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType };
}

export const uploadBlob = async (req: Request) => {
  try {
    const { fileName, fileType } = extractMetadata(req.headers);
    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.uploadStream(req);
    console.log(`Upload block blob ${fileName} successfully`);
    return getBlobUrl(fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getBlobUrl = (fileName: string) => {
  return `${blobEndpoint}${containerName!}/${fileName}`;
};
