function isJSXPath(path) {
  const argument = path.get('argument');
  if (argument.node.type === 'JSXElement') {
    return true;
  }

  if (argument.node.type === 'CallExpression') {
    const callee = argument.get('callee');
    if (callee.matchesPattern('React.createElement')) {
      return true;
    }

    const binding = path.scope.getBinding(callee.node.name);
    if (binding && isReturningJSXElement(binding.path)) {
      return true;
    }
  }

  return false;
}

function isReturningJSXElement(rootPath) {
  const {node} = rootPath;
  if (node.init && node.init.body && node.init.body.type === 'JSXElement') {
    return true;
  }

  let visited = false;
  rootPath.traverse({
    ReturnStatement(path) {
      if (!visited) {
        visited = isJSXPath(path);
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
