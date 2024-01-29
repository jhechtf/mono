import ruleComposer from 'eslint-rule-composer';
import { Linter } from 'eslint';

const preferDestructuring = new Linter().getRules().get('prefer-destructuring');

export default ruleComposer.filterReports(
  preferDestructuring,
  // eslint-disable-next-line
  (problem: any) => {
    if (
      problem.messageId === 'preferDestructuring' &&
      problem.node.type === 'VariableDeclarator'
    ) {
      const { id, init } = problem.node;
      if (id.type === 'Identifier' && init.type === 'MemberExpression')
        return true;
    }
    return false;
  },
);
