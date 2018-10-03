$(document).ready(function () {
  // Connect socket client to the server that served the page
  const socket = io();

  socket.on('changed_order', function (itemIds) {
    orderItemsInDom(itemIds);
  });

  $('#sortable').sortable({
    // Ensure items can be dragged only verticaly
    axis: 'y',

    // Event is triggered when the user stopped sorting and the DOM position has changed.
    update: function (event, ui) {

      const DOMItems = $('#sortable').find('li');
      const itemIds = getIds(DOMItems);

      // When one user changed order of items, reorder items in DOM for all connected users 
      socket.emit('changed_order', itemIds);
    }
  });

  function getIds(items) {
    return $.map(items, function (item) {
      return $(item).attr("id");
    });
  }

  // Order items in DOM based on the order of Ids arg
  function orderItemsInDom(itemIds) {
    let lastSeenItem = null;

    for (let itemId of itemIds) {

      // Select item in DOM by ID
      let item = $("#" + itemId)[0];

      // Remove that item from DOM
      $(item).remove();

      if (lastSeenItem === null) {
        /* Add item to the top of the grid because we know that if lastSeenItem is null item is first on the list */
        $('#sortable').prepend(item);
      } else {
        $(item).insertAfter(lastSeenItem);
      }

      lastSeenItem = item;
    }
  }
});