"use client";

import { getAllTours } from "@/utils/action";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TourList from "./TourList";

const ToursPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["tours"],
    queryFn: () => getAllTours(),
  });

  return (
    <>
      {isPending ? <span className="loading"></span> : <TourList data={data} />}
    </>
  );
};

export default ToursPage;
