import React, { useState, useCallback } from "react";

const Child = React.memo(({ handleClick }) => {
  console.log("Child Rendered");
  return <button onClick={handleClick}>Click Me</button>;
});

function Optimize() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h2>Count: {count}</h2>
      <Child handleClick={increment} />
    </div>
  );
}

export default Optimize;
