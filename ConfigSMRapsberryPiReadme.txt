#update rasp3
sudo rpi-update


#update node
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt install nodejs


#zb bildschirm drehen
sudo nano /boot/config.txt
ls -l
exec $SHELL


#löschen
rm -rf theDir


#check interfaces
sudo iwconfig
sudo ifconfig


#check bus
lsusb


#connect and disconnect to/from wlan0
sudo ifup wlan0
sudo ifdown wlan0


#interfaces einstellen
sudo nano /etc/network/interfaces
//wlan verbindung über wpa_supplicant.conf
auto lo
iface lo inet loopback
iface eth0 inet dhcp
allow-hotplug wlan0
iface wlan0 inet manual
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
iface default inet dhcp
//wlan mit statischer ip addresse
iface wlan0 inet static
  address 192.168.42.1
  netmask 255.255.255.0
#auskommentieren um wlan0 als accesspoint verfügbar zu machen
#allow-hotplug wlan0
#wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
#iface default inet dhcp 

# netzwerke eingeben
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
//
network={
	ssid="SKYA767C"
	psk="House!-01"
}


#allgemeine einstellungen ändern (z.B. Bildschirm rotation)
sudo nano /boot/config.txt


#für autostart entweder sudo nano /etc/rc.local oder
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
#oder
sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart  //
//
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@point-rpi

@xset s off
@xset -dpms
@xset s noblank
@unclutter -idle 1
@chromium-browser --media-cache-dir=/dev/null --disk-cache-dir=/dev/null --kiosk --noerrdialogs
 --disable-restore-session-state --disable-translate -–incognito http://localhost/index.php

@lxterminal --command "sudo node /home/pi/Desktop/SmartMirror/NodeJS/app.js"
#!/bin/bash


#raspberry pi mit pc per ssh verbinden in putty
#ip adresse herausfinden
ifconfig 


#wlan accesspoint darstellen
sudo apt-get install hostapd udhcpd
sudo nano /etc/udhcpd.conf
sudo nano /etc/default/udhcpd
//You will need to give the Pi a static IP address with the following command:
sudo ifconfig wlan0 192.168.42.1
sudo nano /etc/network/interfaces #einstellen wie oben
sudo nano /etc/hostapd/hostapd.conf
//verschlüsselt
interface=wlan0
driver=nl80211
ssid=My_AP
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=My_Passphrase
wpa_key_mgmt=WPA-PSK
#wpa_pairwise=TKIP	# You better do not use this weak encryption (only used by old client devices)
rsn_pairwise=CCMP
//offen
interface=wlan0
ssid=My_AP
hw_mode=g
channel=6
auth_algs=1
wmm_enabled=0
//In addition the built-in Raspberry Pi 3 Wi-Fi module seems to require the following additional parameters:
ieee80211n=1          # 802.11n support
wmm_enabled=1         # QoS support
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
sudo nano /etc/default/hostapd
DAEMON_CONF="/etc/hostapd/hostapd.conf"
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
sudo nano /etc/sysctl.conf
net.ipv4.ip_forward=1