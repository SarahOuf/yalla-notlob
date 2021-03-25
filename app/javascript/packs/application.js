// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require jquery.turbolinks

import "@hotwired/turbo-rails";
import * as ActiveStorage from "@rails/activestorage";
import Rails from "@rails/ujs";
// import "bootstrap";
import "channels";
import "controllers";

Rails.start();
ActiveStorage.start();



class Notifications {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.notifications = $("[data-behavior='notifications']");
    this.unread_count = 0;
    this.firstFetch = 1;
    
    
    $("#view-all").on( "click",function () {
      $(".popup").show();
    });
    
    $("#close, .shadow").on( "click",function () {
      $(".popup").hide();
    });

    if (this.notifications.length > 0) {
      $("[data-behavior='notifications-link']").on("click", this.handleClick);
      this.getNewNotifications();
      setInterval(() => {
        return this.getNewNotifications();
      }, 5000);
    }
  }

  getNewNotifications() {
    $.ajax({
      url: "/notifications.json",
      dataType: "JSON",
      method: "GET",
      success: this.handleSuccess,
    });
  }

  handleClick(e) {
    this.unread_count = 0;
    $.ajax({
      url: "/notifications/mark_as_read",
      dataType: "JSON",
      method: "POST",
      success() {
        $("#unread-count").text(" ");
      },
    });
  }

  handleSuccess(data) {
    let count = this.unread_count;
    if (data["newNotifications"].length > 0) {
      data["newNotifications"].forEach(function (notification) {
        $("#notify").prepend(
          `<li class='dropdown-item'> ${notification.actor} ${notification.text} <a href='${notification.url}'>${notification.link}</a></li>`
        );
        if ($("#all-notify li").length) {
          $("#all-notify").prepend(
            `<li> ${notification.actor} ${notification.text} <a href='${notification.url}'>${notification.link}</a></li>`
          );
        }
        count += 1;
      });
      this.unread_count = count;
      $("#unread-count").text(this.unread_count);

      $.ajax({
        url: "/notifications/mark_as_recieved",
        dataType: "JSON",
        method: "POST",
      });
    }

    if (data["allNotifications"].length > 0 && this.firstFetch) {
      data["allNotifications"].forEach(function (notification) {
        $("#all-notify").prepend(
          `<li> ${notification.actor} ${notification.text}<a href='${notification.url}'>${notification.link}</a></li>`
        );
      });
    }
    this.firstFetch = 0;
  }
}

$(document).ready(function(){
  $("#view-all").on( "click",function () {
    $(".popup").show();
  });
  
  $("#close, .shadow").on( "click",function () {
    $(".popup").hide();
  });
  new Notifications();
}
);

// $(document).on("turbolinks:change", function () {
//   $("#view-all").on( "click",function () {
//     console.log("ff");
//     $(".popup").show();
//   });
// });

// document.addEventListener('turbolinks:load', function () {
//   const viewAll = document.getElementById('view-all');
//   viewAll.addEventListener('click', function () {
//     return $(".popup").show();
//   }, false);
// });
