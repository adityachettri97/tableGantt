import { IAggregatedMeasureData, IMeasureRow, IMeasureField, IMilestone, IProject, IProjectPriority, IViewModel } from "./interfaces";
import { Visual } from "./visual";

export function visualTransform(self: Visual): IViewModel {
  const dataView = self.options.dataViews[0];
  const categorical = dataView.categorical;

  const categories = categorical.categories;
  const values = categorical.values;

  //!Category Field declarations
  const projectPriorityField = categories.find((el) => el.source.roles.projectPriority);
  const projectNameField = categories.find((el) => el.source.roles.projectName);
  const projectRiskField = categories.find((el) => el.source.roles.projectRisk);
  const milestoneNameField = categories.find((el) => el.source.roles.milestoneName);
  const milestonePriorityField = categories.find((el) => el.source.roles.milestonePriority);

  //!Measure Field declarations
  const projectStartDateField = values.find((el) => el.source.roles.projectStartDate);
  const projectEndDateField = values.find((el) => el.source.roles.projectEndDate);
  const milestoneDateField = values.find((el) => el.source.roles.milestoneDate);
  const measureDataFields = values.filter((el) => el.source.roles.measureData);

  const projectPriorities: IProjectPriority[] = [];

  const measureFieldMetada: IMeasureField[] = measureDataFields.map((measureDataField) => {
    const measureName = measureDataField.source.displayName as string;
    return {
      name: measureName,
      isBar: measureName.includes("Bar"),
    };
  });

  //!Most Granular field For Loop
  milestoneNameField.values.forEach((milestoneName: string, index) => {
    const projectPriorityValue = projectPriorityField.values[index] as string;
    const projectNameValue = projectNameField.values[index] as string;
    const projectRiskValue = projectRiskField.values[index] as string;
    const milestonePriorityValue = milestonePriorityField.values[index] as string;
    const projectStartDateValue = projectStartDateField.values[index] as string;
    const projectEndDateValue = projectEndDateField.values[index] as string;
    const milestoneDateValue = milestoneDateField.values[index] as string;

    let projectPriority: IProjectPriority = projectPriorities.find((el) => `${el.name}` === `${projectPriorityValue}`);

    //!Create Priority if none exist
    if (projectPriority === undefined) {
      projectPriority = {
        name: projectPriorityValue as string,
        projects: [],
      };
      projectPriorities.push(projectPriority);
    }

    //!Create Project if none exist inside Project Priority
    let project: IProject = projectPriority.projects.find((el) => `${el.name}` === `${projectNameValue}`);

    if (project === undefined) {
      const aggregatedData: IAggregatedMeasureData[] = measureDataFields.map((measureDataField) => {
        return {
          measureMetada: measureFieldMetada.find((el) => el.name === `${measureDataField.source.displayName}`),
          value: 0,
          measureRows: [],
        };
      });
      project = {
        name: projectNameValue,
        startDate: new Date(projectStartDateValue),
        endDate: new Date(projectEndDateValue),
        aggregatedData: aggregatedData,
        milestones: [],
      };
      projectPriority.projects.push(project);
    }

    const milestone: IMilestone = {
      name: milestoneName,
      priority: milestonePriorityValue,
      milestoneDate: new Date(milestoneDateValue),
    };
    project.milestones.push(milestone);

    project.aggregatedData.forEach((measure, measureIndex) => {
      //! Add Aggregate Measure Data if found
      const measureData: IMeasureRow = {
        name: measureDataFields[measureIndex].source.displayName as string,
        value: measureDataFields[measureIndex].values[index] as number,
      };
      measure.measureRows.push(measureData);

      if (measure.measureMetada.isBar) {
        //! Calculate Avg
        measure.value = measure.measureRows.map((el) => el.value).reduce((a, b) => a + b, 0) / measure.measureRows.length;
      } else {
        //! Calculate Sum
        measure.value = measure.measureRows.map((el) => el.value).reduce((a, b) => a + b, 0);
      }
    });
  });

  return {
    projectPriorities,
    measureFieldMetada,
  };
}
