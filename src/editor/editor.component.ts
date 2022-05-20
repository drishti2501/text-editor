import { Component, OnInit } from '@angular/core';
import * as Y from "yjs";
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { ActivatedRoute } from '@angular/router';
import * as awarenessProtocol from 'y-protocols/awareness.js'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  textContent: any;
  randomId: any;
  
  constructor(private route: ActivatedRoute){
    
  }

  ngOnInit() {
    let id:any;
    this.randomId = Math.floor(Math.random() * 100);
    localStorage['log'] = 'true';

    this.route.queryParams.subscribe(params => {
        console.log(params)
        id = params['id'];
      }
    );
    Quill.register("modules/cursors", QuillCursors);
    const element = document.querySelector('#editor') || '';
    const quill = new Quill(element, {
    modules: {
    cursors: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      
  [{ 'indent': '-1'}, { 'indent': '+1' }],         
  [{ 'direction': 'rtl' }],                         

  [{ 'size': ['small', false, 'large', 'huge'] }],  
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']         
    ],
    history: {
      userOnly: true
    }
  },
  placeholder: "Start collaborating...",
  theme: "snow" 
});

// A Yjs document holds the shared data
const ydoc = new Y.Doc();
console.log(id.toString());
const wsProvider = new WebsocketProvider('ws://10.0.0.114:1234', id.toString(), ydoc,{
  // Set this to `false` if you want to connect manually using wsProvider.connect()
  connect: true,
  // Specify a query-string that will be url-encoded and attached to the `serverUrl`
  // I.e. params = { auth: "bearer" } will be transformed to "?auth=bearer"
  params: {}, // Object<string,string>
  // You may polyill the Websocket object (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
  // E.g. In nodejs, you could specify WebsocketPolyfill = require('ws')
  WebSocketPolyfill: WebSocket,
  // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
  awareness: new awarenessProtocol.Awareness(ydoc),
  // Specify the maximum amount to wait between reconnects (we use exponential backoff).
  maxBackoffTime: 2500
}
);
wsProvider.connect();

// Define a shared text type on the document
console.log(wsProvider.bcconnected);

const ytext = ydoc.getText("quill");

// "Bind" the quill editor to a Yjs text type.
const binding = new QuillBinding(ytext, quill, wsProvider.awareness);

// Remove the selection when the iframe is blurred
window.addEventListener("blur", () => {
  quill.blur();
});
quill.on('text-change', function() {
  console.log(quill.root.innerHTML);
});
  }
  

}
