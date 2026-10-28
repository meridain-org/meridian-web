const validAssetPath = /^[a-zA-Z0-9_/-]+$/;

/** Build a public, transformed Cloudinary delivery URL for an approved public ID. */
export function cloudinaryImageUrl(publicId: string, width = 1200): string | null {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud || !/^[a-zA-Z0-9-]+$/.test(cloud) || !validAssetPath.test(publicId)) return null;
  const boundedWidth = Math.max(320, Math.min(Math.round(width), 2400));
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_fill,w_${boundedWidth}/${publicId}`;
}

export function cloudinaryDeliveryUrl(url: string, resourceType: "image" | "video" = "image"): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud || !url.startsWith(`https://res.cloudinary.com/${cloud}/${resourceType}/upload/`)) return url;
  return url.replace(`/${resourceType}/upload/`, `/${resourceType}/upload/f_auto,q_auto/`);
}
