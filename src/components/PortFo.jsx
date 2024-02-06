import Wrapper from '../assets/wrappers/PortFo';

import React from 'react';

const PortFo = () => {
  return (
    <>
      <link
        href='https://fonts.googleapis.com/icon?family=Material+Icons'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Raleway:200'
        rel='stylesheet'
      />

      <div
        class='container'
        ng-class="{'no-scroll': selected.length}"
        ng-app='app'
        ng-controller='mainCtrl'
      >
        <div class='page'>
          <div class='grid'>
            <div class='grid-item' ng-repeat='item in boxes'>
              <box
                class='box'
                item='item'
                on-select='selectBox'
                ng-class="{'selected': selected[0].item.name == item.name}"
              ></box>
            </div>
          </div>
        </div>
        <div
          class='fullscreen-background top-up'
          ng-show='selected.length'
          ng-style="{'background-image': 'url(' + selected[0].item.image + ')'}"
        ></div>
        <div class='scroller' ng-show='selected.length'>
          <a class='close-button' ng-click='clearSelection()'>
            <i class='material-icons'>close</i>
          </a>
          <h1>Hello</h1>
          <div
            big-box
            ng-repeat='item in selected'
            class='box on-top'
            position='item.position'
            selected='item.item'
          >
            <img ng-src='{{item.item.image}}' alt='' />
            <div class='content'>
              <h2>Lorem ipsum dolor</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
                laborum perferendis, ullam minus. Illo ad aliquid ab magni, enim
                nesciunt at consequuntur dolores explicabo nisi. Dolor,
                reiciendis suscipit alias nemo.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Repellendus consequatur, sit saepe reprehenderit nisi dolorem,
                voluptates amet quos ab assumenda non id accusamus, dicta soluta
                laboriosam voluptas fuga sint deleniti. Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Magnam officiis minus
                tenetur ex molestias qui possimus sit facilis dolorum suscipit.
                Cumque, aperiam inventore nobis? Veniam voluptatibus sapiente
                ea, voluptate dolores?
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Tenetur dicta ducimus ratione reiciendis officia odit omnis
                distinctio, eveniet et modi fuga nisi voluptatem nihil aliquam
                ex pariatur possimus repudiandae vero?
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Corporis, quos ducimus nobis. Necessitatibus provident impedit,
                neque quia dolores? Quas, architecto id. Iure distinctio, illum
                eaque at quia assumenda modi saepe. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Libero soluta quisquam autem quasi
                ut ex ab modi. Sit soluta dicta incidunt quaerat tenetur fugiat,
                natus perspiciatis illo. Totam, quo, minus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortFo;
