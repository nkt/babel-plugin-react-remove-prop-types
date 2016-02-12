function isReturningJSXElement(rootPath) {
  const {node} = rootPath;
  if (node.init && node.init.body && node.init.body.type === 'JSXElement') {
    return true;
  }

  let visited = false;
  rootPath.traverse({
    ReturnStatement(path) {
      if (visited) {
        return;
      }

      const argument = path.get('argument');
      switch (argument.node.type) {
        case 'JSXElement':
          visited = true;
          break;
        case 'CallExpression':
          const {node} = argument.get('callee');
          if (node.object.name === 'React' && node.property.name === 'createElement') {
            visited = true;
          }

          const binding = path.scope.getBinding(node.name);
          if (binding && isReturningJSXElement(binding.path)) {
            visited = true;
          }
          break;
      }
    }
  });

  return visited;
}

function isStatelessComponentType(type) {
  return type === 'VariableDeclarator' || type === 'FunctionDeclaration';
}

function isStatelessComponent(path) {
  return isStatelessComponentType(path.node.type) && isReturningJSXElement(path);
}

export default isStatelessComponent;
