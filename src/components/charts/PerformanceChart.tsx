'use client'

import { GraphData } from "@/app/users/[id]/[mode]/page";
import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import { sortBy, times } from 'lodash'
import moment from "moment";

export default function PerformanceChart({ data }: { data: Array<GraphData> }) {
  const svgRef = useRef(null);
  const [width, setWidth] = useState(1000);
  const height = 150;
  const marginTop = 0;
  const marginRight = 0;
  const marginBottom = 20;
  const marginLeft = 0;

  const [tooltipState, setTooltipState] = useState<{ visible: boolean, data: { x: Date, value: Number } }>({ visible: false, data: { x: new Date(), value: 0 } });

  useEffect(() => {
    if (!svgRef.current) return;
    if (!data.length) return;
    //@ts-ignore
    setWidth(svgRef.current.clientWidth);
    //Removing old data
    d3.select(svgRef.current).select('svg').remove();

    const x = d3.scaleTime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([0, height]);
    const dataset = data.map(d => ({ x: new Date(d.date), value: d.rank })).sort((a, b) => a.x.getTime() - b.x.getTime()) as Array<{ x: Date, value: Number }>;

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('min-width', width + marginLeft + marginRight)
      .attr("width", width + marginLeft + marginRight)
      .attr('height', height + marginTop + marginBottom)
      .on("pointerenter pointermove", showTooltip)
      .on("pointerleave", hideTooltip)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    //adding point to show it when its required
    const point = svg.append("circle");
    point.attr("r", 6);
    point.attr("fill", "#1d81ff");
    point.attr("stroke", "#1d81ff");
    point.attr("stroke-width", 2);
    point.attr("opacity", 0);
    point.attr("transform", "translate(0,0)");

    //Adding tooltip box to display text 

    const bisect = d3.bisector((d: { x: Date, value: Number }) => d.x).center;
    function showTooltip(e: any) {
      if (!data.length) return;
      const i = bisect(dataset, x.invert(d3.pointer(e)[0]));
      const d = dataset[i];
      point.attr("transform", `translate(${x(d.x)}, ${y(d.value)})`);
      point.attr("opacity", 1);
      setTooltipState({ visible: true, data: d });
    }

    function hideTooltip() {
      if (!data.length) return;
      point.attr("opacity", 0);
      setTooltipState((prev) => { return { ...prev, visible: false } });
    }



    //@ts-ignore
    x.domain(d3.extent(dataset, d => d.x));
    //@ts-ignore
    y.domain([0, d3.max(dataset, d => d.value)]);

    //@ts-ignore
    const line = d3.line()
      //@ts-ignore
      .x(d => x(d.x))
      //@ts-ignore
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom);

    svg.append("path")
      .datum(dataset)
      .attr("fill", "none")
      .attr("stroke", "#1d81ff")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      //@ts-ignore
      .attr("d", line);

    //Listening for window width change to update width of element
    window.addEventListener('resize', () => {
      if (!svgRef.current) return;
      //@ts-ignore
      setWidth(svgRef.current.clientWidth);
    });

    return () => {
      window.removeEventListener('resize', () => {
        //@ts-ignore
        setWidth(svgRef.current.clientWidth);
      })
    }

  }, [svgRef, width]);


  return (
    <div ref={svgRef} className="relative w-full">
      <div data-show={tooltipState.visible} className="absolute duration-300 bg-background-950/60 py-2 px-6 w-fit rounded-xl flex flex-col data-[show=false]:opacity-0">
        <span>Rank: <span className="text-primary-600">#{tooltipState.data.value.toString()}</span></span>
        <span>{d3.timeFormat("%Y %b %d")(tooltipState.data.x)}</span>
      </div>
    </div>
  )
}
