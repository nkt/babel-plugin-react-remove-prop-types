export default function () {
  return {
    visitor: {
      Property: {
        exit(path) {
          const {node} = path;
          if (node.computed || node.key.name !== 'propTypes') {
            return;
          }

          const parent = path.findParent((parent) => {
            if (parent.type !== 'CallExpression') {
              return false;
            }

            return parent.get('callee').matchesPattern('React.createClass');
          });

          if (parent) {
            this.dangerouslyRemove();
          }
        }
      },
      AssignmentExpression(path) {
        const {node, scope} = path;
        if (node.left.computed || node.left.property.name !== 'propTypes') {
          return;
        }

        const className = node.left.object.name;
        const binding = scope.getBinding(className);
        if (!binding || !binding.path.isClassDeclaration()) {
          return;
        }

        const superClass = binding.path.get('superClass');
        if (superClass.matchesPattern('React.Component') || superClass.matchesPattern('Component')) {
          this.dangerouslyRemove();
        }
      }
    }
  };
};
