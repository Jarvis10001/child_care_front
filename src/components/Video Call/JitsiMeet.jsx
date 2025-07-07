import React, { useState } from "react";
import axios from "axios";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiMeet = () => {
    const [roomUrl, setRoomUrl] = useState("");

    // Function to create a Jitsi room using POST
    const createRoom = async () => {
        try {
            const response = await axios.post("http://localhost:2006/user/create-room");
            setRoomUrl(response.data.roomUrl);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    return (
        <div>
            <h1>Jitsi Video Call</h1>
            <button onClick={createRoom}>Create Room</button>
            {roomUrl && (
                <JitsiMeeting
                    roomName={roomUrl.split("/").pop()}
                    configOverwrite={{ startWithAudioMuted: true }}
                    interfaceConfigOverwrite={{ SHOW_JITSI_WATERMARK: false }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = "500px";
                        iframeRef.style.width = "100%";
                    }}
                />
            )}
        </div>
    );
};

export default JitsiMeet;
