(function () {
  "use strict";

  var kind = document.body.getAttribute("data-graph-kind");
  var graph = window.network;
  var graphNodes = window.nodes;
  var container = document.getElementById("mynetwork");
  if (!kind || !graph || !graphNodes || !container) return;

  function fit() {
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      graph.fit({ animation: false });
    }
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fit, 120);
  });

  function settleAndFit() {
    var finished = false;
    var deadline;
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(deadline);
      graph.setOptions({ physics: { enabled: false } });
      fit();
    }
    graph.once("stabilizationIterationsDone", finish);
    deadline = setTimeout(finish, 3000);
    setTimeout(fit, 250);
  }

  function addInfo(text) {
    var info = document.createElement("div");
    info.className = "graph-info";
    info.textContent = text;
    container.parentNode.insertBefore(info, container);
  }

  if (kind === "community") {
    addInfo("Node size shows community size. Edge width shows connection strength. Hover over a node or edge for exact values.");
    settleAndFit();
    return;
  }

  if (kind === "subcommunity") {
    var all = graphNodes.get();
    var parentOf = function (node) {
      var match = String(node.title || "").match(/parent=(\d+)/);
      return match ? match[1] : null;
    };
    var parents = Array.from(new Set(all.map(parentOf).filter(function (id) { return id !== null; }))).sort(function (a, b) { return Number(a) - Number(b); });
    var toolbar = document.createElement("div");
    toolbar.className = "graph-toolbar";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "Filter subcommunities");
    var status = document.createElement("span");
    status.className = "graph-status";
    status.setAttribute("role", "status");
    var buttons = [];

    function showParent(parent) {
      graphNodes.update(all.map(function (node) {
        return { id: node.id, hidden: parent !== null && parentOf(node) !== parent };
      }));
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.parent === (parent === null ? "all" : parent)));
      });
      var count = parent === null ? all.length : all.filter(function (node) { return parentOf(node) === parent; }).length;
      status.textContent = parent === null ? "Showing all " + count + " subcommunities" : "Showing " + count + " subcommunities in C" + parent;
      setTimeout(fit, 80);
    }

    function addButton(label, parent, color) {
      var button = document.createElement("button");
      button.type = "button";
      button.dataset.parent = parent === null ? "all" : parent;
      button.setAttribute("aria-pressed", "false");
      if (color) {
        var swatch = document.createElement("span");
        swatch.className = "graph-swatch";
        swatch.style.setProperty("--swatch-color", color);
        swatch.setAttribute("aria-hidden", "true");
        button.appendChild(swatch);
      }
      button.appendChild(document.createTextNode(label));
      button.addEventListener("click", function () { showParent(parent); });
      toolbar.appendChild(button);
      buttons.push(button);
    }

    addButton("All", null);
    parents.forEach(function (parent) {
      var sample = all.find(function (node) { return parentOf(node) === parent; });
      var color = typeof sample.color === "string" ? sample.color : sample.color && sample.color.background;
      addButton("C" + parent, parent, color);
    });
    toolbar.appendChild(status);
    container.parentNode.insertBefore(toolbar, container);
    addInfo("Node size shows subcommunity size. Select a parent community to reduce overlapping connections; hover for exact values.");
    showParent(null);
    settleAndFit();
    return;
  }

  if (kind === "behavior" || kind === "context") {
    var originalShowOnly = window.showOnly;
    var originalShowAll = window.showAll;
    var originalRestabilize = window.restabilize;
    var toolbar = document.getElementById("filterToolbar");
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "Filter graph nodes");
    var buttons = Array.from(toolbar.querySelectorAll("button[onclick]"));
    var status = document.createElement("span");
    status.className = "graph-status";
    status.setAttribute("role", "status");
    toolbar.appendChild(status);
    var colors = {
      PerpProfile: "#3C78D8", Video: "#CC7722", Impact: "#C0504D",
      Party: "#4908BF", Channel: "#2E8B57", Language: "#A134A3",
      Target: "#E67E22", TimeBin: "#B0982E"
    };
    buttons.forEach(function (button) {
      var match = button.getAttribute("onclick").match(/showOnly\('([^']+)'\)/);
      button.dataset.group = match ? match[1] : button.getAttribute("onclick").includes("showAll") ? "all" : "layout";
      if (match) {
        var swatch = document.createElement("span");
        swatch.className = "graph-swatch";
        swatch.style.setProperty("--swatch-color", colors[match[1]] || "#64748b");
        swatch.setAttribute("aria-hidden", "true");
        button.insertBefore(swatch, button.firstChild);
      }
      if (button.dataset.group !== "layout") button.setAttribute("aria-pressed", "false");
    });

    function updateState(group) {
      buttons.forEach(function (button) {
        if (button.dataset.group !== "layout") button.setAttribute("aria-pressed", String(button.dataset.group === group));
      });
      var visible = graphNodes.get().filter(function (node) { return !node.hidden; }).length;
      var label = group === "all" ? "all types" : buttons.find(function (button) { return button.dataset.group === group; }).textContent.trim();
      status.textContent = "Showing " + visible + " nodes: " + label;
      setTimeout(fit, 80);
    }
    window.showOnly = function (group) {
      originalShowOnly(group);
      updateState(group);
    };
    window.showAll = function () {
      originalShowAll();
      updateState("all");
    };
    window.restabilize = function () {
      settleAndFit();
      originalRestabilize();
    };
    updateState("all");
    settleAndFit();
  }
})();
