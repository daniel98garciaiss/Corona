﻿using ISS.Net;
using LogsCol;
using System;
using System.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Integration_Server
{
    public class MainProgram
    {
        public IidkManager iidkManager;
        private string SecurOS_IP = ConfigurationManager.AppSettings["ipSecurOS"];
        private string UinP_ID = ConfigurationManager.AppSettings["UinP"];
        public string Logs_Name = "IntegrationServer";
        public void Main()
        {
            try
            {
                iidkManager = new IidkManager();

                iidkManager.OnConnectionStateChanged += new ConnectionStateListener(this.ConnectionStateChanged);
                iidkManager.OnSecurOSMessage += new MessagesListener(this.SecurOSMessage);


                while(!iidkManager.IsConnected())
                {
                    iidkManager.Connect(SecurOS_IP, "3000", UinP_ID);
                }

                if (iidkManager.IsConnected())
                {
                    Log.Write("Connected with UinP: " + SecurOS_IP + ":" + UinP_ID, "INFO", Logs_Name);

                }
                else
                {
                    Log.Write("Error trying to connect with UinP: " + SecurOS_IP + ":" + UinP_ID, "ERROR", Logs_Name);

                }

            }
            catch (Exception ex)
            {
                Log.Write("Event error in MainProgram: " + ex.Message, "ERROR", Logs_Name);
            }

        }

        /// <summary>
        /// This method can be override since it is virtual.
        /// Original method tries to reconnect every 100 ms to IIDK connection and logs state changes
        /// </summary>
        /// <param name="connected">received bool from connection stateS</param>
        public virtual void ConnectionStateChanged(bool connected)
        {
            Log.Write("ConnectionStateChanged connected: " + connected, "INFO", Logs_Name);
            if (connected)
            {

                Log.Write("UinP connected", "INFO", Logs_Name);
            }
            else if (!iidkManager.IsConnected())
            {
                Log.Write("ConnectionStateChanged connected: " + connected, "INFO", Logs_Name);
                while (!iidkManager.IsConnected())
                {
                    iidkManager.Connect(SecurOS_IP, "3000", UinP_ID);
                }
                Log.Write("UinP connected", "INFO", Logs_Name);
    
            }

        }

        private void SecurOSMessage(ISS.Net.Message msg)
        {
        }

        public void hilo()
        {
        }

    }
}
