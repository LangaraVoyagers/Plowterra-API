class Message {
  type = "";

  constructor(type: string) {
    this.type = type;
  }

  get(result: "success" | "error" | "not_found") {
    if (result === "success") {
      return "";
    }

    if (result === "error") {
      return "Oops! Something went wrong.";
    }

    return `The ${this.type} was not found`;
  }

  create(result: "success" | "error") {
    if (result === "success") {
      return `The ${this.type} was succesfully created.`;
    } else {
      return `Oops! Something went wrong. The ${this.type} was not created.`;
    }
  }

  update(result: "success" | "error", custom = "updated") {
    if (result === "success") {
      return `The ${this.type} was succesfully ${custom}.`;
    } else {
      return `Oops! Something went wrong. The ${this.type} was not updated.`;
    }
  }

  delete(result: "success" | "error") {
    if (result === "success") {
      return `The ${this.type} was succesfully deleted.`;
    } else {
      return `Oops! Something went wrong. The ${this.type} was not deleted.`;
    }
  }
}

export default Message;
