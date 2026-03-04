import React from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from '../ui/Dropdown';

const BottomHeader: React.FC = () => {
  return (
    <nav className="bottom-header">
      <div className="container">
        <ul className="main-nav">
          <li>
            <NavLink to="/">Início</NavLink>
          </li>
          <li className="dropdown">
            <NavLink to="/saae">SAAE LINHARES</NavLink>
            <div className="dropdown-menu">
              <NavLink to="/saae/agente-regulador">Agente Regulador - ARIES</NavLink>
              <NavLink to="/saae/cipa">CIPA</NavLink>
              <NavLink to="/saae/codigo-etica">Código de Ética</NavLink>
              <NavLink to="/saae/historia">História</NavLink>
              <NavLink to="/saae/missao">Missão</NavLink>
              <NavLink to="/saae/lgpd">LGPD</NavLink>
              <div className="dropdown-submenu">
                <NavLink to="/saae/servidor">Servidor</NavLink>
                <div className="submenu">
                  <a href="https://192.168.0.254/" target="_blank">Webmail</a>
                  <a href="https://servicos.cloud.el.com.br/es-linhares-saae/portal/login" target="_blank">Contracheque</a>
                  <NavLink to="/admin">Login ADM</NavLink>
                </div>
              </div>
            </div>
          </li>
          <li className="dropdown">
            <NavLink to="/servicos">Serviços</NavLink>
            <div className="dropdown-menu">
              <NavLink to="/servicos/hidrometro">Seu Hidrômetro</NavLink>
              <NavLink to="/servicos/informacoes-tecnicas">Informações Técnicas</NavLink>
              <NavLink to="/servicos/dicionario">Dicionário</NavLink>
              <NavLink to="/servicos/dicas-consumo">Dicas de Consumo</NavLink>
              <NavLink to="/servicos/conheca-sua-conta">Conheça sua Conta</NavLink>
              <NavLink to="/servicos/onde-pagar">Onde Pagar sua Conta</NavLink>
              <NavLink to="/servicos/tabela-tarifas">Tabela de Tarifas</NavLink>
              <NavLink to="/servicos/documentacao-projeto">Documentação para Projeto</NavLink>
            </div>
          </li>
          <li>
            <a href="https://avsanegraph.com.br/av/lin" target="_blank">Agência Virtual</a>
          </li>
          <li className="dropdown">
            <NavLink to="/qualidade-agua">Qualidade da Água</NavLink>
          </li>
          <li className="dropdown">
            <NavLink to="/imprensa">Imprensa</NavLink>
            <div className="dropdown-menu">
              <NavLink to="/imprensa/noticias">Notícias</NavLink>
              <NavLink to="/imprensa/galeria-fotos">Galeria de Fotos</NavLink>
              <NavLink to="/imprensa/galeria-videos">Galeria de Vídeos</NavLink>
            </div>
          </li>
          <li>
            <a href="http://saaelinhares-es.portaltp.com.br/" target="_blank">Transparência</a>
          </li>
          <li className="dropdown">
            <NavLink to="/licitacoes">Licitações</NavLink>
            <div className="dropdown-menu">
              <a href="http://saaelinhares-es.portaltp.com.br/" target="_blank">Licitações</a>
              <NavLink to="/licitacoes/contratos">Contratos</NavLink>
            </div>
          </li>
          <li>
            <NavLink to="/concursos">Concursos</NavLink>
          </li>
          <li className="dropdown">
            <NavLink to="/atendimento">Atendimento</NavLink>
            <div className="dropdown-menu">
              <NavLink to="/atendimento/telefones-uteis">Telefones Úteis</NavLink>
              <NavLink to="/atendimento/contato">Contato</NavLink>
              <NavLink to="/atendimento/links-uteis">Links Úteis</NavLink>
              <NavLink to="/atendimento/localizacao">Localização</NavLink>
              <NavLink to="/atendimento/perguntas-frequentes">Perguntas Frequentes</NavLink>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BottomHeader;