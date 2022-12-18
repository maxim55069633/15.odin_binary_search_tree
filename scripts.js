class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  construct_sub_tree(source_array, start = 0, end = source_array.length - 1) {
    if (start > end) return null;
    let mid = Math.trunc((start + end) / 2);

    let root = new Node(source_array[mid]);
    root.left = this.construct_sub_tree(source_array, start, mid - 1);
    root.right = this.construct_sub_tree(source_array, mid + 1, end);
    return root;
  }

  buildTree(source_array) {
    let processed_array = [
      ...new Set(
        source_array.sort(function (a, b) {
          return a - b;
        })
      ),
    ];
    this.root = this.construct_sub_tree(processed_array);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node == null) {
      console.log("Can't print null!");
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(value, current_root = this.root) {
    if (current_root == null) {
      current_root = new Node(value);
      if (this.root == null) this.root = current_root;
    } else if (value == current_root.data) {
      console.log("Can't insert a repeated value ");
    } else if (value < current_root.data) {
      current_root.left = this.insert(value, current_root.left);
    } else if (value > current_root.data) {
      current_root.right = this.insert(value, current_root.right);
    }

    return current_root;
  }

  delete(value, current_root = this.root) {
    let reserved_current_node = current_root;

    if (current_root == null) {
      console.log("Can't delete the non-existent node");
      return current_root;
    } else if (current_root.data > value) {
      current_root.left = this.delete(value, current_root.left);
      return current_root;
    } else if (current_root.data < value) {
      current_root.right = this.delete(value, current_root.right);
      return current_root;
    } else if (current_root.data == value) {
      // 1) Current node doesn't have any children
      if (current_root.right == null && current_root.left == null) {
        current_root = null;
      } else if (current_root.left == null && current_root.right != null) {
        // One of the children is null
        current_root = current_root.right;
      } else if (current_root.left != null && current_root.right == null) {
        // One of the children is null
        current_root = current_root.left;
      } else if (current_root.left != null && current_root.right != null) {
        // Current Node has two children
        let RChild_of_current = current_root.right;
        if (RChild_of_current.left == null) {
          RChild_of_current.left = current_root.left;
          current_root = RChild_of_current;
        } else if (RChild_of_current.left != null) {
          let tmp = RChild_of_current.left;
          while (tmp.left != null) {
            tmp = tmp.left;
          }
          current_root.data = tmp.data;

          current_root.right = this.delete(
            current_root.data,
            current_root.right
          );
        }
      }
      if (reserved_current_node != this.root) return current_root;
      // even the reserved_current_node data equals this.root data, the structure is different
    }

    if (reserved_current_node == this.root) {
      // Check whether this reversed node is the root node
      // There won't be a repeated value, since we do not allow repeated value
      this.root = current_root;
    }
  }

  find(value) {
    if (this.root == null) {
      console.log("Can't find the value in this tree");
      return null;
    }
    let tmp = this.root;
    while (tmp) {
      if (tmp.data > value) {
        tmp = tmp.left;
        continue;
      } else if (tmp.data < value) {
        tmp = tmp.right;
        continue;
      } else if (tmp.data == value) {
        return tmp;
      }
    }
    console.log("Can't find the value in this tree");
    return null;
  }

  levelOrder(func = 0) {
    if (this.root == null) {
      console.log("This tree is empty");
      return;
    }

    let node_array = [];
    let level_order_all_data = [];
    let tmp = this.root;
    node_array.push(tmp);

    if (func == 0) {
      while (node_array.length != 0) {
        tmp = node_array.shift();
        level_order_all_data.push(tmp.data);

        if (tmp.left != null) node_array.push(tmp.left);
        if (tmp.right != null) node_array.push(tmp.right);
      }
      return level_order_all_data;
    }

    while (node_array.length != 0) {
      tmp = node_array.shift();
      func(tmp);
      if (tmp.left != null) node_array.push(tmp.left);
      if (tmp.right != null) node_array.push(tmp.right);
    }
  }

  preorder(func = 0) {
    if (this.root == null) {
      console.log("This tree is empty");
      return;
    }
    let node_array = [];
    let preorder_all_data = [];
    let tmp = this.root;
    node_array.push(tmp);

    if (func == 0) {
      while (node_array.length != 0) {
        tmp = node_array.pop();
        preorder_all_data.push(tmp.data);

        if (tmp.right != null) node_array.push(tmp.right);
        if (tmp.left != null) node_array.push(tmp.left);
      }
      return preorder_all_data;
    }

    while (node_array.length != 0) {
      tmp = node_array.pop();
      func(tmp);
      if (tmp.right != null) node_array.push(tmp.right);
      if (tmp.left != null) node_array.push(tmp.left);
    }
  }

  inorder(func = 0, current_root = this.root) {
    if (this.root == null) {
      console.log("This tree is empty");
    }
    if (func != 0) {
      if (current_root == null) {
        return;
      }
      if (current_root.left != null) this.inorder(func, current_root.left);
      func(current_root);
      if (current_root.right != null) this.inorder(func, current_root.right);
    } else {
      let inorder_all_data = [];

      let inorder_L_data = [];
      let inorder_P_data = [];
      let inorder_R_data = [];

      if (current_root == null) {
        return inorder_all_data;
      }
      if (current_root.left != null)
        inorder_L_data = this.inorder(func, current_root.left);
      inorder_P_data.push(current_root.data);
      if (current_root.right != null)
        inorder_R_data = this.inorder(func, current_root.right);

      inorder_all_data = inorder_L_data.concat(inorder_P_data, inorder_R_data);
      return inorder_all_data;
    }
  }

  postorder(func = 0, current_root = this.root) {
    if (this.root == null) {
      console.log("This tree is empty");
    }
    if (func != 0) {
      if (current_root == null) {
        return;
      }
      if (current_root.left != null) this.postorder(func, current_root.left);
      if (current_root.right != null) this.postorder(func, current_root.right);
      func(current_root);
    } else {
      let inorder_all_data = [];

      let inorder_L_data = [];
      let inorder_P_data = [];
      let inorder_R_data = [];

      if (current_root == null) {
        return inorder_all_data;
      }
      if (current_root.left != null)
        inorder_L_data = this.postorder(func, current_root.left);
      inorder_P_data.push(current_root.data);
      if (current_root.right != null)
        inorder_R_data = this.postorder(func, current_root.right);

      inorder_all_data = inorder_L_data.concat(inorder_R_data, inorder_P_data);
      return inorder_all_data;
    }
  }

  height(node = this.root) {
    if (node == null) return 0;
    if (node.left == null && node.right == null) return 1;
    if (node.left != null && node.right == null)
      return 1 + this.height(node.left);
    if (node.left == null && node.right != null)
      return 1 + this.height(node.right);
    if (node.left != null && node.right != null)
      return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  depth(node) {
    if (this.find(node.data) == null) {
      console.log("This given node doesn't exist in this tree");
      return null;
    } else {
      let depth = 0;
      let tmp = this.root;
      while (tmp) {
        if (tmp.data == node.data) return depth;
        else if (tmp.data < node.data) {
          depth += 1;
          tmp = tmp.right;
          continue;
        } else if (tmp.data > node.data) {
          depth += 1;
          tmp = tmp.left;
          continue;
        }
      }
    }
  }

  isBalanced(node = this.root) {
    if (this.root == null) {
      console.log("This tree doesn't exist");
      return false;
    }

    let balance_array = [];
    this.levelOrder((node) => {
      let left_subtree_h;
      let right_subtree_h;
      let height_difference;
      left_subtree_h = this.height(node.left);
      right_subtree_h = this.height(node.right);
      height_difference = Math.abs(left_subtree_h - right_subtree_h);
      if (height_difference <= 1) balance_array.push(true);
      else balance_array.push(false);
    });
    if (balance_array.includes(false)) return false;
    else return true;
  }

  rebalance() {
    this.buildTree(this.inorder());
  }
}

function create_random_array() {
  const array_length = Math.floor(Math.random() * 16);
  let random_array = [];
  for (let i = 0; i < array_length; i++)
    random_array.push(Math.floor(Math.random() * 100));
  return random_array;
}

let test = new Tree();
test.buildTree(create_random_array());
test.prettyPrint();
console.log(`Is this tree balanced ${test.isBalanced()}`);
console.log(`Print out all elements in level: ${test.levelOrder()}`);
console.log(`Print out all elements in preorder: ${test.preorder()}`);
console.log(`Print out all elements in inorder: ${test.inorder()}`);
console.log(`Print out all elements in postorder: ${test.postorder()}`);
test.insert(103);
test.insert(200);
test.insert(150);
test.insert(143);
test.prettyPrint();
console.log(`After insertion, is this tree balanced ${test.isBalanced()}`);
test.rebalance();
console.log(`After rebalance, is this tree balanced ${test.isBalanced()}`);
console.log(`Print out all elements in level: ${test.levelOrder()}`);
console.log(`Print out all elements in preorder: ${test.preorder()}`);
console.log(`Print out all elements in inorder: ${test.inorder()}`);
console.log(`Print out all elements in postorder: ${test.postorder()}`);
