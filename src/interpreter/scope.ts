export class Scope {
  private readonly variables = new Map<string, unknown>();
  private readonly constants = new Map<string, unknown>();

  constructor(private readonly parentScope: Scope | null = null) {
  }

  getVariable(variableName: string): unknown {
    if (this.variables.has(variableName)) {
      return this.variables.get(variableName);
    }

    if (this.constants.has(variableName)) {
      return this.constants.get(variableName);
    }

    if (this.parentScope) {
      return this.parentScope.getVariable(variableName);
    }

    throw new Error(`Property with name "${variableName}" not found`);
  }

  assignVariable(variableName: string, variableValue: unknown): void {
    if (this.variables.has(variableName)) {
      this.variables.set(variableName, variableValue);
      return;
    }

    if (this.constants.has(variableName)) {
      throw new Error(`Assignment to constant variable`);
    }

    if (this.parentScope) {
      return this.parentScope.assignVariable(variableName, variableValue);
    }

    throw new Error(`Variable with name "${variableName}" not found`);
  }

  defineVariable(variableName: string, variableValue: unknown): void {
    if (this.variables.has(variableName)) {
      throw new Error(`Variable with name "${variableName}" already defined`);
    }

    this.variables.set(variableName, variableValue);
  }

  defineConstant(variableName: string, variableValue: unknown) {
    if (this.constants.has(variableName)) {
      throw new Error(`Variable with name "${variableName}" already defined`);
    }

    this.constants.set(variableName, variableValue);
  }
}