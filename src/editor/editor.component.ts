import { Component, OnInit } from '@angular/core';
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
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
const provider = new WebrtcProvider(id.toString(), ydoc,{ signaling: ['ws://localhost:4444'],password: this.randomId.toString(),awareness:  new awarenessProtocol.Awareness(ydoc),maxConns: Number.POSITIVE_INFINITY,filterBcConns: false,peerOpts: {}});

// Define a shared text type on the document
console.log(ydoc);
const ytext = ydoc.getText("quill");

// "Bind" the quill editor to a Yjs text type.
const binding = new QuillBinding(ytext, quill, provider.awareness);

// Remove the selection when the iframe is blurred
window.addEventListener("blur", () => {
  quill.blur();
});
quill.on('text-change', function() {
  console.log(quill.root.innerHTML);
});
  }
  

}
