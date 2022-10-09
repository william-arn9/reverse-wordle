export class AppUtils {

  static validateIndexesAreFilled(array: Array<any>, maxIndex: number): boolean {
    for(let i = 0; i <= maxIndex; i++) {
      if(!array[i] || array[i].length < 1) {
        return false;
      }
    }
    return true;
  }

  static buildString(array: Array<string>) {
    let ret = '';
    array.forEach((arrString) => {
      ret += arrString;
    });
    return ret;
  }

  static shuffleString(string: string) {
    var a = string.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
}