import { Scope } from './scope';
import { FunctionDeclarationNode } from '../ast/ast-node';

export class Func {
  constructor(
    public readonly node: FunctionDeclarationNode,
    public readonly parentScope: Scope
  ) {
  }
}