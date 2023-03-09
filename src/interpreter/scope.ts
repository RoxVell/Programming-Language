export type Variable = {
  type: 'Variable',
  value: unknown;
  isConst: boolean;
};

export class Scope {
  private readonly variables = new Map<string, Variable>();

  constructor(private readonly parentScope: Scope | null = null) {
  }

  getVariable(variableName: string): Variable {
    if (this.variables.has(variableName)) {
      return this.variables.get(variableName)!;
    }

    if (this.parentScope) {
      return this.parentScope.getVariable(variableName);
    }

    throw new Error(`Property with name "${variableName}" not found`);
  }

  assignVariable(variableName: string, variableValue: unknown): void {
    if (this.variables.has(variableName)) {
      const variable = this.getVariable(variableName);

      if (variable.isConst) {
        throw new Error(`Assignment to constant variable`);
      }

      variable.value = variableValue;

      return;
    }

    if (this.parentScope) {
      return this.parentScope.assignVariable(variableName, variableValue);
    }

    throw new Error(`Variable with name "${variableName}" not found`);
  }

  defineVariable(variableName: string, variableValue: unknown, isConst: boolean): void {
    if (this.variables.has(variableName)) {
      throw new Error(`Variable with name "${variableName}" already defined`);
    }

    this.variables.set(variableName, { type: 'Variable', isConst, value: variableValue });
  }
}