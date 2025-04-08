class Person {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    console.log(`ich bin ${this.name}`);
  }
}

const rudi = new Person('Rudolf');
rudi.introduce();

function parse(callback) {
  callback();
}

const abc = () => rudi.introduce();

parse(abc);
