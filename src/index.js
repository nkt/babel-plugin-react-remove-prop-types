import isStatelessComponent from './is-stateless-component';

export default function() {
  function isReactComponent(superClass) {
    return superClass.matchesPattern('React.Component') || superClass.matchesPattern('Component');
  }

  return {
    visitor: {
      ObjectProperty(path) {
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
          path.remove();
        }
      },
      ClassProperty(path) {
        const {node, scope} = path
        if (node.key.name !== 'propTypes') {
          return;
        }

        const className = scope.block.id.name;
        const binding = scope.getBinding(className);
        const superClass = binding.path.get('superClass');
        if (isReactComponent(superClass)) {
          path.remove();
        }
      },
      AssignmentExpression(path) {
        const {node, scope} = path;
        const {left} = node;
        if (left.computed || !left.property || left.property.name !== 'propTypes') {
          return;
        }

        const className = left.object.name;
        const binding = scope.getBinding(className);
        if (!binding) {
          return;
        }

        if (binding.path.isClassDeclaration()) {
          const superClass = binding.path.get('superClass');
          if (isReactComponent(superClass)) {
            path.remove();
          }
        } else if (isStatelessComponent(binding.path)) {
          path.remove();
        }
      }
    }
  };
}
