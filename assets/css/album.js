/**
 * This global array holds our collection of albums
 */
var albums = [{
  title: "The White Album",
  band:  "The Beatles",
  year:  1968
}];


/**
 * jQuery ready function executed on page load,
 * renders the table
 */
$(document).ready(function() {
  renderTable();
});

/**
 * This function pulls data from the HTML form and adds it to
 * the table.  It does some rudimetary error checking for
 * missing values or invalid years.
 */
function addAlbum() {

  //pull data from the forms
  var albumTitle = $("#inputAlbumTitle").val();
  var albumBand  = $("#inputBand").val();
  var albumReleaseYear = parseInt($("#inputReleaseYear").val());

  //clear form data
  $("#inputAlbumTitle").val("");
  $("#inputBand").val("");
  $("#inputReleaseYear").val("");

  //error checking
  if(albumTitle === "") {
    addErrorBox("Album title cannot be empty!");
    return;
  } else if(albumBand === "") {
    addErrorBox("Band cannot be empty!");
    return;
  } else if(isNaN(albumReleaseYear)) {
    addErrorBox("Release Year does not appear to be valid");
    return;
  }

  var newAlbum = {
    title: albumTitle,
    band:  albumBand,
    year:  albumReleaseYear
  };

  //check that the album is not a duplicate
  if(isDuplicate(newAlbum)) {
    addErrorBox("Album is already in your collection!");
    return;
  }

  //add the album to the array
  albums.push(newAlbum);

  //format a new HTML row
  var newRow = "<tr>" +
               "<td>" + albums.length + "</td>" +
               "<td>" + albumTitle + "</td>" +
               "<td>" + albumBand + "</td>" +
               "<td>" + albumReleaseYear + "</td>" +
               "<td><span onclick='removeItem(this)' class='pointer'>&times;</span></td>" +
               "</tr>";
  $("#albumTable").append(newRow);
}

/**
 * Serializes the albums array and stores
 * it to local storage
 */
function saveAlbums() {
  var albumsObject = {
    "albums": albums
  };
  var albumString = JSON.stringify(albums);
  localStorage.setItem("albums", albumString);
}

/**
 * Loads the albums from local storage
 * and stores them into the global albums array
 */
function loadAlbums() {
  var albumString = localStorage.getItem("albums");
  albums = JSON.parse(albumString);
  renderTable();
}

/**
 * Rebuilds/renders the albums table using the global
 * albums array
 */
function renderTable() {

  $("#albumTable tbody").empty();
  for(var i=0; i<albums.length; i++) {
      var newRow = "<tr>" +
               "<td>" + (i+1) + "</td>" +
               "<td>" + albums[i].title + "</td>" +
               "<td>" + albums[i].band + "</td>" +
               "<td>" + albums[i].year + "</td>" +
               "<td><span onclick='removeItem(this)' class='pointer'>&times;</span></td>" +
               "</tr>";
      $("#albumTable").append(newRow);
  }
  $("#albumTable").hide().fadeIn();
}

/**
 * Uses the findIndex() method (ES6 only) to search for the
 * given album in the albums array, returns true or false
 * depending on whether or not the album is already part of
 * the collection.
 */
function isDuplicate(album) {
  var index = albums.findIndex(function(element, index, array) {
    if(element.title === album.title &&
       element.band  === album.band  &&
       element.year  === album.year) {
      return true;
    }
  });
  if(index === -1) {
    return false;
  } else {
    return true;
  }
}

/**
 * Removes the album (both from the table and the albums
 * array) corresponding to the delete button passed to the
 * function.
 */
function removeItem(obj) {

  //get the album title, band and year from the parent row
  var row = obj.parentNode.parentNode; //row
  var album = {
    title: row.cells[1].innerHTML,
    band:  row.cells[2].innerHTML,
    year:  parseInt(row.cells[3].innerHTML)
  };

  //find the album in the array
  var index = albums.findIndex(function(element, index, array) {
    if(element.title === album.title &&
       element.band  === album.band  &&
       element.year  === album.year) {
      return true;
    }
  });

  //remove element from table
  if(index !== -1) {
    albums.splice(index, 1);
  } else {
    addErrorBox("Internal error: cannot find album!");
    return;
  }
  //remove the element from the table
  $(obj).parent().parent().remove();
}


/**
 * Adds an error/bootstrap alert box with the given message
 */
function addErrorBox(errorMessage) {
  var errorDiv = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                 '<button type="button" class="close" data-dismiss="alert">' +
                 '<span aria-hidden="true" style="cursor: pointer;">&times;</span>' +
                 '<span class="sr-only">Close</span></button>' +
                 '<strong>ERROR!</strong> '+errorMessage+'</div>';
  $('#errorArea').empty();
  $('#errorArea').append(errorDiv);
  $('#errorArea').hide().fadeIn("slow");
}
