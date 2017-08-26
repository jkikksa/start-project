let Tabs = function (options) {
  this.linksContainer = options.linksContainer;
  let tabContainer = options.tabContainer;
  let linkClassName = options.linkClassName;
  let tabs = options.tabs;
  let linkActiveClass = options.linkActiveClass;
  let tabActiveClass = options.tabActiveClass;
  let onTabChanged = options.onTabChanged;

  let activeLink = this.linksContainer.querySelector('.' + linkActiveClass);
  let activePanel = tabContainer.querySelector('.' + tabActiveClass);

  let map = Array.prototype.reduce.call(tabs, function (accum, it, index) {
    accum[it.getAttribute('id')] = index;
    return accum;
  }, {});

  let hideActiveTab = function () {
    activeLink.classList.remove(linkActiveClass);
    activePanel.classList.remove(tabActiveClass);
  };

  let showActiveTab = function (link, targetTab) {
    link.classList.add(linkActiveClass);
    targetTab.classList.add(tabActiveClass);
    onTabChanged(link);
  };

  let getTargetTab = function (link) {
    return tabs[map[link.getAttribute('href').slice(1)]];
  };

  let changeTab = function (link) {
    hideActiveTab();
    let targetTab = getTargetTab(link);
    showActiveTab(link, targetTab);
    activeLink = link;
    activePanel = targetTab;
  };

  this.onLinkClicked = function (evt) {
    let clickedLink = evt.target;

    if (!clickedLink.classList.contains(linkClassName)) {
      return;
    }
    evt.preventDefault();

    changeTab(clickedLink);
  };
};

Tabs.prototype.init = function () {
  this.linksContainer.addEventListener('click', this.onLinkClicked);
};

Tabs.prototype.destroy = function () {
  this.linksContainer.removeEventListener('click', this.onLinkClicked);
};

module.exports = Tabs;
