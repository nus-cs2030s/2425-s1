function editor(id) {
  var editor = ace.edit(id);
  editor.session.setMode("ace/mode/java");
}