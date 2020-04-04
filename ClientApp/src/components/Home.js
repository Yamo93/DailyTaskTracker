import React, { Component } from 'react';
import ReleaseNews from '../components/ReleaseNews';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Welcome to your Daily Task Tracker!</h1>
            <p>With this application, you can record your daily tasks at work and integrate them with your GitHub branches or your Trello boards.</p>
            <p>The application is created with: </p>
        <ul>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
          <li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
                <li><a href='https://reactstrap.github.io//'>Reactstrap</a> for layout and styling</li>
        </ul>
        <ReleaseNews />
      </div>
    );
  }
}
