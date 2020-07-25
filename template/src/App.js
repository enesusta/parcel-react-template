import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/parcel" component={() => 'parcel'} />
        </Switch>
    </Router>
);

export default App;
