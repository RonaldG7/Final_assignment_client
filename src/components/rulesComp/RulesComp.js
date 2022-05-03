import React from 'react';
import "./style.css"

const RulesComp = () => {
    return (
        <div className="app p-5 padding-sm">
            <div>
                <div className="rulesHeader p-2">
                    Rules
                </div>
                <div className="rulesBody p-2">
                    <p>
                        We hope that the tone of this forum is friendly and helpful, please keep that in mind when
                        posting.
                        We also have the following more specific rules we expect to be carried out in all posts:
                    </p>
                    <ul>
                        <li>Don't insult other users, you can post your opinion, and you can criticize, but posts
                            written purely to offend will be removed.
                        </li>
                        <li>
                            If you think someone else has made an offensive post or is causing some kind of problem,
                            don't try to deal with it yourself, report it to a moderator or an administrator.
                        </li>
                        <li>
                            Posts should be on topic and preferably make a positive contribution to the discussion.
                        </li>
                        <li>
                            Please post only in English. If you have difficulty writing in English language you can use
                            an online translator to help you.
                        </li>
                    </ul>
                    <p>
                        Breaking the rules may result in your post being removed or edited. Repeatedly breaking the
                        rules may result in a temporary or permanent ban.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RulesComp;