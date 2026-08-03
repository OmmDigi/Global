class ArrayNode {
  public max_item = 0;
  public array: number[] = [];
  public total_item = 0;
  public next_node: ArrayNode | null = null;

  constructor(max_item: number = 5) {
    this.max_item = max_item;
  }
}

class DynamicArray {
  private current_node: ArrayNode;
  private starting_node: ArrayNode;

  constructor(max_item: number = 5) {
    let node = new ArrayNode(max_item);
    this.starting_node = node;
    this.current_node = node;
  }

  push(item: number) {
    if (this.current_node.total_item >= this.current_node.max_item) {
      // create a new array node
      let new_node = new ArrayNode(this.current_node.max_item * 2);
      this.current_node.next_node = new_node;
      this.current_node = new_node;
    }

    this.current_node.total_item += 1;
    this.current_node.array.push(item);
  }

  printAll() {
    // for dbuging only
    let present_node: ArrayNode | null = this.starting_node;
    while (present_node != null) {
      for (const item of present_node.array) {
        console.log(item);
      }
      present_node = present_node.next_node;
    }
  }

  private findIndexNode(index: number): {
    originalIndex: number;
    originalNode: ArrayNode;
  } {
    let present_node: ArrayNode = this.starting_node;
    let finalIndex = index;
    let found = false;
    while (found == false) {
      if (index + 1 > present_node.total_item) {
        if (present_node.next_node) {
          present_node = present_node.next_node;
          finalIndex -= present_node.total_item + 2;
        } else {
          found = true;
        }
      } else {
        found = true;
      }
    }
    return {
      originalNode: present_node,
      originalIndex: finalIndex,
    };
  }

  get(index: number) {
    let orginalNode = this.findIndexNode(index);
    return orginalNode.originalNode.array[orginalNode.originalIndex];
  }

  add(index: number, item: number) {
    let { originalIndex, originalNode } = this.findIndexNode(index);
    originalNode.array[originalIndex] = item;
  }
}

let darray = new DynamicArray();
darray.push(1);
darray.push(2);
darray.push(3);
darray.push(4);
darray.push(5);
darray.push(6);
darray.push(7);
darray.push(8);

// darray.printAll();
