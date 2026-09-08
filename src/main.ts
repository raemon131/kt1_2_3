// Make all properties optional
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type OptionalTodo = {
  [K in keyof Todo]?: Todo[K];
};

// Remove 'readonly' and '?' modifiers
type Concrete<T> = {
  -readonly [K in keyof T]-?: T[K];
};

// Add 'readonly' and 'required' to all properties
type ReadonlyRequired<T> = {
  +readonly [K in keyof T]-?: T[K];
};

const t1: OptionalTodo = { title: "Learn TS" };
console.log(t1.title);
console.log(String(t1.description));
console.log(String(t1.completed));

const t2: Concrete<OptionalTodo> = {
  title: "Learn TS",
  description: "Learn TypeScript",
  completed: false,
};
console.log(t2.title);
console.log(t2.description);
console.log(t2.completed);

const t3: ReadonlyRequired<OptionalTodo> = {
  title: "Learn TS",
  description: "Learn TypeScript",
  completed: false,
};
console.log(t3.title);
console.log(t3.description);
console.log(t3.completed);
