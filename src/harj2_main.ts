export interface Circle {
  kind: "circle";
  radius: number;
}

export interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

export interface Square {
  kind: "square";
  size: number;
}

export type Shape = Circle | Rectangle | Square;

export function isCircle(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}

export function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
    default: {
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
    }
  }
}
 