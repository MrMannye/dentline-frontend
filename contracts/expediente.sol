// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClinicaDental {

    struct Paciente {
        string nombre;
        string profesion;
        uint edad;
        string tipoSangre;
        string[] alergias;
        string hashDatosMedicos;
    }

    struct Dentista {
        string nombre;
        string profesion;
        string telefono;
    }

    struct Cita {
        uint fecha;
        string motivo;
        uint costoTotal;
        string observaciones;
        string hashDatosCita;
    }

    Paciente private paciente;
    Dentista private dentista;
    Cita[] private citas;

    address private admin;
    mapping(address => bool) private personalAutorizado;

    event CitaAgregada(uint fecha, string motivo, uint costoTotal);
    event DatosModificados(string entidad, address usuario);
    event AccesoRegistrado(string entidad, address usuario, uint timestamp);

    constructor(
        string memory _nombrePacienteEncriptado,
        string memory _profesionPacienteEncriptada,
        uint _edadPaciente,
        string memory _tipoSangreEncriptado,
        string[] memory _alergiasEncriptadas,
        string memory _hashDatosMedicosEncriptado,
        string memory _nombreDentistaEncriptado,
        string memory _profesionDentistaEncriptada,
        string memory _telefonoEncriptado
    ) {
        admin = msg.sender;
        paciente = Paciente(_nombrePacienteEncriptado, _profesionPacienteEncriptada, _edadPaciente, _tipoSangreEncriptado, _alergiasEncriptadas, _hashDatosMedicosEncriptado);
        dentista = Dentista(_nombreDentistaEncriptado, _profesionDentistaEncriptada, _telefonoEncriptado);
    }

    modifier soloAutorizado() {
        require(personalAutorizado[msg.sender] || msg.sender == admin, "Acceso denegado: no autorizado");
        _;
    }

    function cambiarPermisoAcceso(address _usuario, bool _permiso) public {
        require(msg.sender == admin, "Solo el admin puede cambiar permisos");
        personalAutorizado[_usuario] = _permiso;
        emit DatosModificados("PermisoAcceso", msg.sender);
    }

    // Métodos para obtener información encriptada del paciente sin registrar acceso
    function getHashDatosPaciente() public view soloAutorizado returns (string memory) {
        return paciente.hashDatosMedicos;
    }

    function getNombrePacienteEncriptado() public view soloAutorizado returns (string memory) {
        return paciente.nombre;
    }
    
    function getProfesionPacienteEncriptada() public view soloAutorizado returns (string memory) {
        return paciente.profesion;
    }
    
    function getEdadPacienteEncriptada() public view soloAutorizado returns (uint) {
        return paciente.edad;
    }
    
    function getTipoSangrePacienteEncriptado() public view soloAutorizado returns (string memory) {
        return paciente.tipoSangre;
    }
    
    function getAlergiasPacienteEncriptadas() public view soloAutorizado returns (string[] memory) {
        return paciente.alergias;
    }

    // Métodos de registro de acceso para obtener información encriptada del paciente
    function registrarAccesoNombrePaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.Nombre", msg.sender, block.timestamp);
        return paciente.nombre;
    }

    function registrarAccesoProfesionPaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.Profesion", msg.sender, block.timestamp);
        return paciente.profesion;
    }

    function registrarAccesoEdadPaciente() public soloAutorizado returns (uint) {
        emit AccesoRegistrado("Paciente.Edad", msg.sender, block.timestamp);
        return paciente.edad;
    }

    function registrarAccesoTipoSangrePaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.TipoSangre", msg.sender, block.timestamp);
        return paciente.tipoSangre;
    }

    function registrarAccesoAlergiasPaciente() public soloAutorizado returns (string[] memory) {
        emit AccesoRegistrado("Paciente.Alergias", msg.sender, block.timestamp);
        return paciente.alergias;
    }

    // Métodos para obtener información encriptada del dentista sin registrar acceso
    function getNombreDentistaEncriptado() public view soloAutorizado returns (string memory) {
        return dentista.nombre;
    }
    
    function getProfesionDentistaEncriptada() public view soloAutorizado returns (string memory) {
        return dentista.profesion;
    }
    
    function getTelefonoDentistaEncriptado() public view soloAutorizado returns (string memory) {
        return dentista.telefono;
    }

    // Método para agregar una nueva cita con información encriptada
    function agregarCita(uint _fecha, string memory _motivoEncriptado, uint _costoTotal, string memory _observacionesEncriptadas, string memory _hashDatosCitaEncriptado) public soloAutorizado {
        citas.push(Cita(_fecha, _motivoEncriptado, _costoTotal, _observacionesEncriptadas, _hashDatosCitaEncriptado));
        emit CitaAgregada(_fecha, _motivoEncriptado, _costoTotal);
    }

    // Método para obtener una cita específica encriptada por índice sin registrar acceso
    function getCitaEncriptada(uint index) public view soloAutorizado returns (uint, string memory, uint, string memory, string memory) {
        require(index < citas.length, "Cita no existe");
        Cita memory cita = citas[index];
        return (cita.fecha, cita.motivo, cita.costoTotal, cita.observaciones, cita.hashDatosCita);
    }

    // Método de registro de acceso para obtener una cita específica encriptada por índice
    function registrarAccesoCita(uint index) public soloAutorizado returns (uint, string memory, uint, string memory, string memory) {
        require(index < citas.length, "Cita no existe");
        Cita memory cita = citas[index];
        emit AccesoRegistrado("Cita", msg.sender, block.timestamp);
        return (cita.fecha, cita.motivo, cita.costoTotal, cita.observaciones, cita.hashDatosCita);
    }

    // Método para obtener el número total de citas
    function getNumeroDeCitas() public view returns (uint) {
        return citas.length;
    }
}