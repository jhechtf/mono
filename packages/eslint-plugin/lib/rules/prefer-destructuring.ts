import ruleComposer from 'eslint-rule-composer';
import { Linter } from 'eslint';

// Base rule
const preferDestructuring = new Linter().getRules().get('prefer-destructuring');

// New rule.
export default ruleComposer.filterReports(
  preferDestructuring,
  (problem, _metadata) => {
    if (problem.messageId === 'preferDestructuring' && problem.node.type === 'VariableDeclarator') {
      const { id, init } = problem.node;
      if (id.type === 'Identifier' && init.type === 'MemberExpression') return true;
    }
    return false;
  }
);
