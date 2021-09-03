using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Integration_Server
{
    [RunInstaller(true)]
    public partial class ProjectInstaller : System.Configuration.Install.Installer
    {
        public ProjectInstaller()
        {
            InitializeComponent();
        }

        protected override void OnAfterInstall(IDictionary savedState)
        {
            string Message =
                                         "\nGENERIC_DOOR = GENERIC_DOOR.png" +
                                         "\nGENERIC_INPUT = GENERIC_INPUT.png" +
                                         "\nGENERIC_OUTPUT = GENERIC_OUTPUT.png" +
                                         "\nGENERIC_RELAY = GENERIC_RELAY.png" +
                                         "\nGENERIC_SENSOR = GENERIC_SENSOR.png" +
                                         "\nGENERIC_SMOKE_DETECTOR = GENERIC_SMOKE_DETECTOR.png" +
                                         "\nGENERIC_FIRE_DETECTOR = GENERIC_FIRE_DETECTOR.png" +
                                         "\nGENERIC_INTRUSION_DETECTOR = GENERIC_INTRUSION_DETECTORl.png" +
                                         "\nGENERIC_AREA = GENERIC_AREA.png" +
                                         "\nRECEIVER = RECEIVER.png" +
                                         "\nPANEL = PANEL.png" +
                                         "\nPARTITION = PARTITION.png" +
                                         "\nSENSOR = SENSOR.png"
                                         ;

            string path = "C:\\Program Files (x86)\\ISS\\SecurOS\\Modules\\map";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filepath = "C:\\Program Files (x86)\\ISS\\SecurOS\\Modules\\map\\Map" + ".ini";
            if (!File.Exists(filepath))
            {
                // Create a file to write to.   
                using (StreamWriter sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
            else
            {
                using (StreamWriter sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
        }
        private void serviceProcessInstaller1_AfterInstall(object sender, InstallEventArgs e)
        {

        }

        private void serviceInstaller1_AfterInstall(object sender, InstallEventArgs e)
        {

        }
    }
}
