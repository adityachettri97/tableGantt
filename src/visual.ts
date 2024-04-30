"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import { Selection, extent, scaleTime, select, style } from "d3";
import { flatten } from "lodash";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { IProject, IViewModel } from "./interfaces";
import { visualTransform } from "./visualTransform";

export class Visual implements IVisual {
  private target: HTMLElement;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  public visualDiv: Selection<HTMLDivElement, unknown, HTMLElement, any>;
  public tableBody: Selection<HTMLDivElement, unknown, HTMLElement, any>;
  public viewModel: IViewModel;
  public options: VisualUpdateOptions;

  constructor(options: VisualConstructorOptions) {
    this.formattingSettingsService = new FormattingSettingsService();
    this.target = options.element;
    this.visualDiv = select(this.target).append("div").classed("visualDiv", true);
    this.tableBody = this.visualDiv.append("table");
  }

  public update(options: VisualUpdateOptions) {
    this.options = options;
    this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);
    this.tableBody.selectAll("*").remove();

    this.viewModel = visualTransform(this);

    const highColor = "#e74c3c";
    const mediumColor = "#f1c40f";
    const lowColor = "#B0CBE6";
    const barWidth = 200;
    const ganttWidth = 250;
    const thead = this.tableBody.append("thead");
    const columnRow = thead.append("tr");
    columnRow.append("th").text("Project Priority");
    columnRow.append("th").text("Project");

    this.viewModel.measureFieldMetada.forEach((measureField) => {
      const measureColumn = columnRow.append("th").text(measureField.name);

      if (measureField.isBar) {
        measureColumn.style("min-width", `${barWidth}px`);
      }
    });
    columnRow.append("th").text("Gantt").style("min-width", `${ganttWidth}px`);

    const tbody = this.tableBody.append("tbody");

    const allDates = [];
    const allProjects: IProject[] = flatten(this.viewModel.projectPriorities.map((priority) => priority.projects));
    allProjects.forEach((project) => {
      allDates.push(new Date(project.startDate));
      allDates.push(new Date(project.endDate));
    });

    var xScale = scaleTime()
      .domain(
        extent(allDates, function (date) {
          return date;
        })
      )
      .range([0, ganttWidth]); // Set the pixel range

    this.viewModel.projectPriorities.forEach((projectPriority) => {
      projectPriority.projects.forEach((project, index) => {
        const row = tbody.append("tr");

        if (index === 0) {
          row.append("td").text(projectPriority.name).attr("rowspan", projectPriority.projects.length);
        }
        row.append("td").text(project.name);

        project.aggregatedData.forEach((measure) => {
          if (measure.measureMetada.isBar) {
            const barCell = row.append("td").style("background", "#eeeeee");
            createBarCell(barCell, measure.value, "#2980b9");
          } else {
            row.append("td").text(measure.value);
          }
        });

        // const progressCell = row.append("td").style("background", "#eeeeee");
        // createBarCell(
        //   progressCell,
        //   project.ProgressPercentage,
        //   project.Risk === "High" ? highColor : project.Risk === "Medium" ? mediumColor : lowColor
        // );
        // const consumptionCell = row.append("td").style("background", "#eeeeee");
        // createBarCell(consumptionCell, project.ConsumptionPercentage, "#2980b9");

        // row.append("td").text(`$${project.Budget}`);

        const ganttCell = row.append("td").style("position", "relative");
        const endDate = new Date(project.endDate);
        const startDate = new Date(project.startDate);

        ganttCell
          .append("div")
          .style("background", "#eeeeee")
          .style("width", `${xScale(endDate) - xScale(startDate)}px`)
          .style("height", `calc(100% - ${10}px)`)
          .style("margin-left", `${xScale(startDate)}px`);

        const milestoneSize = 10;
        project.milestones.forEach((milestone) => {
          ganttCell
            .append("div")
            .classed("milestone", true)
            .style("width", `${milestoneSize}px`)
            .style("height", `${milestoneSize}px`)
            .style("background", "red")
            .style("top", `calc(50% - ${milestoneSize / 2}px)`)
            .style("left", `${xScale(new Date(milestone.milestoneDate))}px`)
            .style("background", milestone.priority === "High" ? highColor : milestone.priority === "Medium" ? mediumColor : lowColor);
        });
      });
    });
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
  }
}

function createBarCell(barCell, percentage: number, background: string) {
  const barPadding = 4;

  barCell
    .append("div")
    .classed("tableBar", true)
    .style("width", `${percentage}%`)
    .style("height", `calc(100% - ${barPadding * 2}px)`)
    .style("background", background)
    .text(`${percentage.toFixed(0)}%`);
}

/*
    const allDates = [];
    const allProjects = flatten(sampleProjectData.map((project) => project.Projects));
    allProjects.forEach((project) => {
      allDates.push(new Date(project.StartDate));
      allDates.push(new Date(project.EndDate));
    });

    var xScale = scaleTime()
      .domain(
        extent(allDates, function (date) {
          return date;
        })
      )
      .range([0, ganttWidth]); // Set the pixel range

    sampleProjectData.forEach((el) => {
      el.Projects.forEach((project, index) => {
        const row = tbody.append("tr");

        if (index === 0) {
          row.append("td").text(el.ProjectPriority).attr("rowspan", el.Projects.length);
        }
        row.append("td").text(project.Name);
        const progressCell = row.append("td").style("background", "#eeeeee");
        createBarCell(
          progressCell,
          project.ProgressPercentage,
          project.Risk === "High" ? highColor : project.Risk === "Medium" ? mediumColor : lowColor
        );
        const consumptionCell = row.append("td").style("background", "#eeeeee");
        createBarCell(consumptionCell, project.ConsumptionPercentage, "#2980b9");

        row.append("td").text(`$${project.Budget}`);

        const ganttCell = row.append("td").style("position", "relative");
        const endDate = new Date(project.EndDate);
        const startDate = new Date(project.StartDate);

        ganttCell
          .append("div")
          .style("background", "#eeeeee")
          .style("width", `${xScale(endDate) - xScale(startDate)}px`)
          .style("height", `calc(100% - ${10}px)`)
          .style("margin-left", `${xScale(startDate)}px`);

        const milestoneSize = 10;
        project.Tasks.forEach((task) => {
          ganttCell
            .append("div")
            .classed("milestone", true)
            .style("width", `${milestoneSize}px`)
            .style("height", `${milestoneSize}px`)
            .style("background", "red")
            .style("top", `calc(50% - ${milestoneSize / 2}px)`)
            .style("left", `${xScale(new Date(task.TaskDate))}px`)
            .style("background", task.TaskPriority === "High" ? highColor : task.TaskPriority === "Medium" ? mediumColor : lowColor);
        });*/
