(function() {
    var app = angular.module('Calculator', []);
  
    var Node = function(eval, prev, next) {
      this.eval = eval;
      this.prev = prev;
      this.next = next;
    }
  
    app.controller('MainController', function() {
      var root = null, clear = false;
      this.answer = 0;
  
      var result = function(node) {
        if (typeof node.prev === 'object')
          return node.eval(result(node.prev), node.next);
  
        return node.eval(node.prev, node.next);
      };
  
      var push = function(eval, prev, next) {
        clear = true;
  
        if (root === null) {
          root = new Node(eval, prev, next);
          return prev;
        }
  
        root.next = prev;
        root = new Node(eval, root, next);
        return result(root);
      }
  
      this.reset = function() {
        this.clear();
        root = null;
      };
  
      this.clear = function() {
        this.answer = 0;
        clear = false;
      };
  
      this.num = function(n) {
        if (clear) this.clear();
        this.answer = parseFloat(this.answer + n);
      };
  
      this.add = function() {
        this.answer = push(function(a, b) {
          return a + b;
        }, this.answer, 0);
      };
  
      this.sub = function() {
        this.answer = push(function(a, b) {
          return a - b;
        }, this.answer, 0);
      };
  
      this.mul = function() {
        this.answer = push(function(a, b) {
          return a * b;
        }, this.answer, 1);
      };
  
      this.div = function() {
        this.answer = push(function(a, b) {
          return a / b;
        }, this.answer, 1);
      };
  
      this.mod = function() {
        push(function(a, b) {
          return a % b;
        }, this.answer, 1);
      };
  
      this.total = function() {
        if (root === null) return;
        root.next = this.answer;
        this.answer = result(root);
        root = null;
      };
    });
  }());