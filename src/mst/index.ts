import { applySnapshot, Instance, types } from "mobx-state-tree";
import * as uuid from "uuid";

const EmployeeModel = types.model("", {
  id: types.identifier,
  name: types.string,
  hours_worked: types.number,
});

const EmployerModel = types
  .model("Employer", {
    id: types.identifier,
    name: types.string,
    location: types.string,
    employees: types.array(EmployeeModel),
  })
  .actions((self) => {
    function newEmployee(name: string, hours_worked: number) {
      const id = uuid.v4();
      applySnapshot(self, {
        ...self,
        employees: [{ id, name, hours_worked }, ...self.employees],
      });
    }
    return { newEmployee };
  })
  .views((self) => ({
    get num_employees() {
      return self.employees.length;
    },
    filtered_employees(searchString: string) {
      return self.employees.filter((employee) =>
        employee.name.includes(searchString)
      );
    },
  }));

const RootModel = types.model("Root", {
  employer: EmployerModel,
});

export { RootModel };

export type Root = Instance<typeof RootModel>;
export type Employer = Instance<typeof EmployerModel>;
export type Employee = Instance<typeof EmployeeModel>;
