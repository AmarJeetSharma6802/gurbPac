"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "/api/controllers/task"
      );

      const result = await res.json();

      setData(result);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        Total Tasks:
        {data.totalTasks}
      </h1>

      <h1>
        Active Tasks:
        {data.activeTasks}
      </h1>

      <h1>
        Expired Tasks:
        {data.expiredTasks}
      </h1>

      <h1>
        Last Date:
        {data.lastDateOfTask}
      </h1>
    </div>
  );
}